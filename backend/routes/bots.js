import express from 'express'
import { ensureLoggedIn } from '../handlers/ensure-logged-in.js'
import { getUserById } from '../db/models/user.js'
import { sendError } from '../handlers/error.js'
import { BotsModel, BotsType, getBotById, getBotsByUserId } from '../db/models/bots/bots.js'
import { getFirstRealToken, getFirstSandboxToken } from '../utils/tokens.js'
import { BotManager } from '../bots/bot-manager.js'
import { IntervalBot } from '../bots/interval/interval-bot.js'
import { getInstrumentByUid } from '../db/models/catalog/common.js'

export const botsRouter = express.Router()

/* POST /api/bots/interval-bot
 *
 * Добавление интервального бота
 */
botsRouter.post('/api/bots/interval-bot', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const { product, bounds, stepsCount, amountPerStep, accountType, selectedAccount } = req.body

    const token = accountType === 'real' ? getFirstRealToken(user) : getFirstSandboxToken(user)

    if (!token) {
      return sendError(res, 403, 'Ошибка', 'Не найден подходящий токен')
    }

    const productData = await getInstrumentByUid(product)

    if (!productData) {
      return sendError(res, 403, 'Ошибка', 'Продукт не найден')
    }

    const result = await new BotsModel({
      userId: user._id,
      type: BotsType.interval,
      created: new Date(),
      accountType,
      selectedAccount,
      active: true,
      properties: { product: productData, bounds, stepsCount, amountPerStep }
    }).save()

    const botId = result._id.toString()

    BotManager.instance.addBot(new IntervalBot({
      token,
      account: selectedAccount,
      product: productData,
      bounds,
      stepsCount,
      amountPerStep,
      id: botId
    }))

    res.status(200).send({ success: true, data: { id: botId } })
  } catch (error) {
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
    const bots = await getBotsByUserId(user._id)
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
    if (!bot || req.user._id.toString() !== bot.userId.toString()) {
      return sendError(res, 403, 'Ошибка', 'Такой бот не найден')
    }
    const { _id, type, created, accountType, selectedAccount, properties, active } = bot
    const data = { type, created, accountType, selectedAccount, properties, active, id: _id }
    res.status(200).send({ success: true, data })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

/* PUT /api/bots/:id/stop
 *
 * Получение информации по конкретному боту
 */
botsRouter.put('/api/bots/:id/stop', ensureLoggedIn, async (req, res) => {
  try {
    const bot = await getBotById(req.params.id)
    if (!bot || req.user._id.toString() !== bot.userId.toString()) {
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
