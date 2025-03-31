import express from 'express'
import { ensureLoggedIn } from '../handlers/ensure-logged-in.js'
import { sendError } from '../handlers/error.js'
import { getBondsData, getCurrencyData, getStocksData, mergeWithMOEXData } from '../utils/moex.js'
import { CatalogBondsModel } from '../db/models/catalog/bonds.js'
import { CatalogStocksModel } from '../db/models/catalog/stocks.js'
import { CatalogCurrenciesModel } from '../db/models/catalog/currencies.js'
import { getInstrumentByIsin } from '../db/models/catalog/common.js'
import { CatalogFuturesModel } from '../db/models/catalog/futures.js'
import { Helpers, TinkoffInvestApi } from 'tinkoff-invest-api'
import { getUserById } from '../db/models/user.js'
import { getFirstSandboxToken } from '../utils/tokens.js'

// https://www.moex.com/ru/marketdata/#/mode=groups&group=3&collection=7&boardgroup=58&data_type=current&category=main

export const catalogRouter = express.Router()

catalogRouter.get('/api/catalog', ensureLoggedIn, async (req, res) => {
  try {
    // const bondsData = await CatalogBondsModel.find({})
    const stocksData = await CatalogStocksModel.find({})
    // const currencyData = await CatalogCurrenciesModel.find({})
    const futuresData = await CatalogFuturesModel.find({})
    const data = stocksData.map(({ name, isin, figi, ticker, uid, lot, minPriceIncrement }) => ({ name, isin, figi, ticker, uid, lot, minPriceIncrement, type: 'stock' }))
      // .concat(bondsData.map(({ name, isin, figi, ticker, uid, lot }) => ({ name, isin, figi, ticker, uid, lot, type: 'bond' })))
      // .concat(currencyData.map(({ name, isin, figi, ticker, uid, lot }) => ({ name, isin, figi, ticker, uid, lot, type: 'currency' })))
      .concat(futuresData.map(({ name, isin, figi, ticker, uid, lot, minPriceIncrement }) => ({ name, isin, figi, ticker, uid, lot, minPriceIncrement, type: 'future' })))

    res.status(200).send({ success: true, data })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

catalogRouter.get('/api/catalog/bonds', ensureLoggedIn, async (req, res) => {
  try {
    const data = await CatalogBondsModel.find({})
    const moex = await getBondsData()
    const instruments = mergeWithMOEXData(data, moex)
    res.status(200).send({ success: true, data: { instruments, moex } })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

catalogRouter.get('/api/catalog/bonds/:isin', ensureLoggedIn, async (req, res) => {
  try {
    const isin = req.params.isin
    const data = await CatalogBondsModel.findOne({ isin }).lean()
    const {
      _id, __v, ...rest
    } = data
    res.status(200).send({ success: true, data: rest })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

catalogRouter.get('/api/catalog/stocks', ensureLoggedIn, async (req, res) => {
  try {
    const data = await CatalogStocksModel.find({})
    const moex = await getStocksData()
    const instruments = mergeWithMOEXData(data, moex)
    res.status(200).send({ success: true, data: { instruments, moex } })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

catalogRouter.get('/api/catalog/stocks/:isin', ensureLoggedIn, async (req, res) => {
  try {
    const isin = req.params.isin
    const data = await CatalogStocksModel.findOne({ isin }).lean()
    const {
      _id, __v, ...rest
    } = data
    res.status(200).send({ success: true, data: rest })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

catalogRouter.get('/api/catalog/currency', ensureLoggedIn, async (req, res) => {
  try {
    const data = await CatalogCurrenciesModel.find({})
    const moex = await getCurrencyData()
    const instruments = mergeWithMOEXData(data, moex)
    res.status(200).send({ success: true, data: { instruments, moex } })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

catalogRouter.get('/api/catalog/currency/:ticker', ensureLoggedIn, async (req, res) => {
  try {
    const ticker = req.params.ticker
    const data = await CatalogCurrenciesModel.findOne({ ticker }).lean()
    const {
      _id, __v, ...rest
    } = data
    res.status(200).send({ success: true, data: rest })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

catalogRouter.get('/api/catalog/futures', ensureLoggedIn, async (req, res) => {
  try {
    const data = await CatalogFuturesModel.find({})
    res.status(200).send({ success: true, data: { instruments: data } })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

catalogRouter.get('/api/catalog/futures/:ticker', ensureLoggedIn, async (req, res) => {
  try {
    const ticker = req.params.ticker
    const data = await CatalogFuturesModel.findOne({ ticker }).lean()
    const {
      _id, __v, ...rest
    } = data
    res.status(200).send({ success: true, data: rest })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

catalogRouter.get('/api/catalog/futures/:ticker/margin', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)

    const token = getFirstSandboxToken(user)

    if (!token) {
      return sendError(res, 403, 'Ошибка', 'Не найден подходящий токен')
    }

    const ticker = req.params.ticker
    const productData = await getInstrumentByIsin(ticker)

    if (!productData) {
      return sendError(res, 403, 'Ошибка', 'Продукт не найден')
    }

    if (productData.type !== 'future') {
      return sendError(res, 403, 'Ошибка', 'Продукт не является фьючерсом')
    }

    const api = new TinkoffInvestApi({ token: token.token })
    const response = await api.instruments.getFuturesMargin({ figi: productData.figi, instrumentId: productData.uid })

    const data = {
      initialMarginOnBuy: Helpers.toNumber(response.initialMarginOnBuy),
      initialMarginOnSell: Helpers.toNumber(response.initialMarginOnSell),
      minPriceIncrement: Helpers.toNumber(response.minPriceIncrement),
      minPriceIncrementAmount: Helpers.toNumber(response.minPriceIncrementAmount)
    }

    res.status(200).send({ success: true, data })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Ошибка при получении параметров фьюча')
  }
})

catalogRouter.get('/api/catalog/instrument/:isin', ensureLoggedIn, async (req, res) => {
  try {
    const isin = req.params.isin
    const data = getInstrumentByIsin(isin)

    if (!data) {
      sendError(res, 404, 'Ошибка', 'Инструмент не найден')
      return
    }

    res.status(200).send({ success: true, data })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})
