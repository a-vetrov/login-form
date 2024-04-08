import express from 'express'
import { ensureLoggedIn } from '../handlers/ensure-logged-in.js'
import { getUserById } from '../db/models/user.js'
import { getFirstSandboxToken } from '../utils/tokens.js'
import { sendError } from '../handlers/error.js'
import { TinkoffInvestApi } from 'tinkoff-invest-api'
import { getBondsData, getCurrencyData, getStocksData, mergeWithMOEXData } from '../utils/moex.js'

// https://www.moex.com/ru/marketdata/#/mode=groups&group=3&collection=7&boardgroup=58&data_type=current&category=main

export const catalogRouter = express.Router()

catalogRouter.get('/api/catalog/bonds', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const token = getFirstSandboxToken(user)

    if (!token) {
      return sendError(res, 403, 'Ошибка', 'Не удалось найти подходящий токен')
    }

    const api = new TinkoffInvestApi({ token: token.token })

    const data = await api.instruments.bonds({})
    const moex = await getBondsData()
    const instruments = mergeWithMOEXData(data.instruments, moex)
    res.status(200).send({ success: true, data: { instruments, moex } })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

catalogRouter.get('/api/catalog/stocks', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const token = getFirstSandboxToken(user)

    if (!token) {
      return sendError(res, 403, 'Ошибка', 'Не удалось найти подходящий токен')
    }

    const api = new TinkoffInvestApi({ token: token.token })

    const data = await api.instruments.shares({})
    const moex = await getStocksData()
    const instruments = mergeWithMOEXData(data.instruments, moex)
    res.status(200).send({ success: true, data: { instruments, moex } })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

catalogRouter.get('/api/catalog/currency', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const token = getFirstSandboxToken(user)

    if (!token) {
      return sendError(res, 403, 'Ошибка', 'Не удалось найти подходящий токен')
    }

    const api = new TinkoffInvestApi({ token: token.token })

    const data = await api.instruments.currencies({})
    const moex = await getCurrencyData()
    const instruments = mergeWithMOEXData(data.instruments, moex)
    res.status(200).send({ success: true, data: { instruments, moex } })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})
