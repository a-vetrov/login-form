import express from 'express'
import { ensureLoggedIn } from '../handlers/ensure-logged-in.js'
import { sendError } from '../handlers/error.js'
import { getUserById } from '../db/models/user.js'
import { getFirstSandboxToken } from '../utils/tokens.js'
import { CandlesLoader, TinkoffInvestApi } from 'tinkoff-invest-api'

export const marketDataRouter = express.Router()

marketDataRouter.get('/api/market-data/last-price/:instrumentId', ensureLoggedIn, async (req, res) => {
  try {
    const instrumentId = req.params.instrumentId
    if (!instrumentId) {
      return sendError(res, 404, 'Ошибка', 'Инструмент не найден')
    }
    const user = await getUserById(req.user._id)
    const token = getFirstSandboxToken(user)

    if (!token) {
      return sendError(res, 403, 'Ошибка', 'Не удалось найти подходящий токен')
    }

    const api = new TinkoffInvestApi({ token: token.token })

    const data = await api.marketdata.getLastPrices({ figi: [], instrumentId: [instrumentId] })

    res.status(200).send({ success: true, data })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

marketDataRouter.get('/api/market-data/candles/:instrumentId', ensureLoggedIn, async (req, res) => {
  try {
    const instrumentId = req.params.instrumentId
    if (!instrumentId) {
      return sendError(res, 404, 'Ошибка', 'Инструмент не найден')
    }
    const user = await getUserById(req.user._id)
    const token = getFirstSandboxToken(user)

    if (!token) {
      return sendError(res, 403, 'Ошибка', 'Не удалось найти подходящий токен')
    }

    const api = new TinkoffInvestApi({ token: token.token })

    // создать инстанс загрузчика свечей
    const candlesLoader = new CandlesLoader(api, { cacheDir: '.cache' })

    // загрузить минимум 100 последних свечей (в понедельник будут использованы данные пятницы, итп)
    const data = await candlesLoader.getCandles({
      figi: instrumentId,
      instrumentId,
      interval: parseInt(req.query.interval) || 3, // 3 - 15 минут
      to: req.query.to ? new Date(parseInt(req.query.to)) : undefined,
      minCount: 200 // <- этот параметр позволяет задать кол-во свечей в результате
    })

    res.status(200).send({ success: true, data: { ...data } })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})
