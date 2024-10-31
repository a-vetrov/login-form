import express from 'express'
import { ensureLoggedIn } from '../handlers/ensure-logged-in.js'
import { getUserById } from '../db/models/user.js'
import { sendError } from '../handlers/error.js'
import { checkToken } from './tinkoff.js'

export const botsRouter = express.Router()

/* POST /api/bots/interval-bot
 *
 * Добавление интервального бота
 */
botsRouter.post('/api/bots/interval-bot', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const { product } = req.body
    console.log(req.body)
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
    res.status(200).send({ success: true, data: [] })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})
