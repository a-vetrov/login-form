import express from 'express'
import { ensureLoggedIn } from '../handlers/ensure-logged-in.js'
import { getUserById } from '../db/models/user.js'
import { sendError } from '../handlers/error.js'
import { BotsModel, BotsType, getAllBots, getBotById, getBotsByUserId } from '../db/models/bots/bots.js'
import { getFirstRealToken, getFirstSandboxToken } from '../utils/tokens.js'
import { BotManager } from '../bots/bot-manager.js'
import { IntervalBot } from '../bots/interval/interval-bot.js'
import { getInstrumentByUid } from '../db/models/catalog/common.js'
import { getBotOrders, getBotSuccessOrders, OrdersModel } from '../db/models/bots/order.js'
import { getBotSteps, IntervalStepModel } from '../db/models/bots/interval-step.js'
import { Helpers, TinkoffInvestApi } from 'tinkoff-invest-api'
import { isAdmin } from '../utils/user.js'
import { getBotStatistics } from '../bots/interval/iterval-statistics.js'

export const botsRouter = express.Router()

/* POST /api/bots/interval-bot
 *
 * Добавление интервального бота
 */
botsRouter.post('/api/bots/interval-bot', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)

    const { product, bounds, stepsCount, stepProfit, amountPerStep, accountType, selectedAccount } = req.body

    const token = accountType === 'real' ? getFirstRealToken(user) : getFirstSandboxToken(user)

    if (!token) {
      return sendError(res, 403, 'Ошибка', 'Не найден подходящий токен')
    }

    const productData = await getInstrumentByUid(product)

    if (!productData) {
      return sendError(res, 403, 'Ошибка', 'Продукт не найден')
    }

    const bots = await getBotsByUserId(user._id)

    if (bots.some((item) => item.active && item.properties.get('product').isin === productData.isin)) {
      return sendError(res, 403, 'Ошибка', 'Бот с таким продуктом уже существует')
    }

    if (productData.type === 'future') {
      const api = new TinkoffInvestApi({ token: token.token })
      const response = await api.instruments.getFuturesMargin({ figi: productData.figi, instrumentId: productData.uid })
      productData.initialMarginOnBuy = Helpers.toNumber(response.initialMarginOnBuy)
      productData.initialMarginOnSell = Helpers.toNumber(response.initialMarginOnSell)
      productData.minPriceIncrement = Helpers.toNumber(response.minPriceIncrement)
      productData.minPriceIncrementAmount = Helpers.toNumber(response.minPriceIncrementAmount)
    }

    const result = await new BotsModel({
      userId: user._id,
      type: BotsType.interval,
      created: new Date(),
      accountType,
      selectedAccount,
      active: true,
      properties: { product: productData, bounds, stepsCount, amountPerStep, stepProfit }
    }).save()

    const botId = result._id.toString()

    const intervalBot = new IntervalBot({
      token,
      account: selectedAccount,
      accountType,
      product: productData,
      bounds,
      stepsCount,
      stepProfit,
      amountPerStep,
      id: botId,
      userId: user._id.toString()
    })

    IntervalStepModel.insertMany(intervalBot.steps.map((step) => {
      return {
        min: step.bounds.min,
        max: step.bounds.max,
        state: step.state,
        serialNumber: step.serialNumber,
        botId: result._id
      }
    }))
    await result.save()

    BotManager.instance.addBot(intervalBot)
    await intervalBot.start()

    res.status(200).send({ success: true, data: { id: botId } })
  } catch (error) {
    console.log(error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

/* GET /api/bots
 *
 * Получение списка всех ботов
 */
botsRouter.get('/api/bots', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const bots = isAdmin(req.user) ? await getAllBots() : await getBotsByUserId(user._id)
    const data = bots.map(item => {
      const { _id, type, created, accountType, selectedAccount, properties, active } = item
      return { type, created, accountType, selectedAccount, properties, active, id: _id }
    })
    res.status(200).send({ success: true, data })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

/* GET /api/bots/:id
 *
 * Получение информации по конкретному боту
 */
botsRouter.get('/api/bots/:id', ensureLoggedIn, async (req, res) => {
  try {
    const bot = await getBotById(req.params.id)
    if (!bot || (req.user._id.toString() !== bot.userId.toString() && !isAdmin(req.user))) {
      return sendError(res, 403, 'Ошибка', 'Такой бот не найден')
    }
    const { _id, type, created, accountType, selectedAccount, properties, active } = bot
    const data = { type, created, accountType, selectedAccount, properties, active, id: _id }
    // data.orders = await getBotOrders(bot._id)
    if (type === 'interval') {
      const steps = await getBotSteps(_id)
      data.steps = steps.map(({ serialNumber, min, max }) => ({ serialNumber, min, max }))
    }
    res.status(200).send({ success: true, data })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

/* GET /api/bots/:id/orders
 *
 * Получение списка ордеров по конкретному боту
 */
botsRouter.get('/api/bots/:id/orders', ensureLoggedIn, async (req, res) => {
  try {
    const admin = isAdmin(req.user)
    const bot = await getBotById(req.params.id)
    if (!bot || (req.user._id.toString() !== bot.userId.toString() && !admin)) {
      return sendError(res, 403, 'Ошибка', 'Такой бот не найден')
    }
    const orders = await getBotSuccessOrders(bot._id)

    const info = {}
    if (bot.type === BotsType.interval) {
      const dbSteps = await getBotSteps(bot._id)
      info.steps = dbSteps.map(({ botId, min, max, orders, serialNumber, state }) => ({ botId, bounds: { min, max }, orders, serialNumber, state }))
    }
    if (admin) {
      info.ordersAll = await getBotOrders(bot._id)
    }
    res.status(200).send({ success: true, data: { orders, ...info } })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

/* GET /api/bots/:id/stats
 *
 * Получение статистики по боту
 */
botsRouter.get('/api/bots/:id/stats', ensureLoggedIn, async (req, res) => {
  try {
    const bot = await getBotById(req.params.id)
    if (!bot || (req.user._id.toString() !== bot.userId.toString() && !isAdmin(req.user))) {
      return sendError(res, 403, 'Ошибка', 'Такой бот не найден')
    }

    const info = {
      lastPrice: bot.properties.get('lastPrice'),
      product: bot.properties.get('product')
    }

    if (!bot.active) {
      const user = await getUserById(req.user._id)
      const token = getFirstSandboxToken(user)
      const instrumentId = bot.properties.get('product').uid

      if (token) {
        const api = new TinkoffInvestApi({ token: token.token })
        const data = await api.marketdata.getLastPrices({ figi: [], instrumentId: [instrumentId] })
        const price = data.lastPrices.find((item => item.instrumentUid === instrumentId))?.price
        if (price) {
          info.currentPrice = Helpers.toNumber(price)
        }
      }
    }

    const orders = await getBotSuccessOrders(bot._id)
    const steps = await getBotSteps(bot._id)

    const statistics = getBotStatistics(orders, steps, info)

    res.status(200).send({ success: true, data: { ...statistics, ...info } })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

/* PUT /api/bots/:id/stop
 *
 * Остановка бота
 */
botsRouter.put('/api/bots/:id/stop', ensureLoggedIn, async (req, res) => {
  try {
    const bot = await getBotById(req.params.id)
    if (!bot || (req.user._id.toString() !== bot.userId.toString() && !isAdmin(req.user))) {
      return sendError(res, 403, 'Ошибка', 'Такой бот не найден')
    }
    BotManager.instance.stopBot(req.params.id)

    bot.active = false
    await bot.save()
    res.status(200).send({ success: true })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})
