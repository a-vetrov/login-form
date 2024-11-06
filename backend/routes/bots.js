import express from 'express'
import { ensureLoggedIn } from '../handlers/ensure-logged-in.js'
import { getUserById } from '../db/models/user.js'
import { sendError } from '../handlers/error.js'
import { checkToken } from './tinkoff.js'
import { BotsModel, BotsType, getBotsByUserById } from '../db/models/bots/bots.js'

export const botsRouter = express.Router()

/* POST /api/bots/interval-bot
 *
 * Добавление интервального бота
 */
botsRouter.post('/api/bots/interval-bot', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const { product, bounds, stepsCount, amountPerStep, accountType, selectedAccount } = req.body

    await new BotsModel({
      userId: user._id,
      type: BotsType.interval,
      created: new Date(),
      accountType,
      selectedAccount,
      properties: { product, bounds, stepsCount, amountPerStep }
    }).save()

    res.status(200).send({ success: true })
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
    const bots = await getBotsByUserById(user._id)
    const data = bots.map(item => {
      const { _id, type, created, accountType, selectedAccount, properties } = item
      return { type, created, accountType, selectedAccount, properties, id: _id }
    })
    res.status(200).send({ success: true, data })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})
