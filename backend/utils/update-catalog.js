import { credentials } from '../config.js'
import { TinkoffInvestApi } from 'tinkoff-invest-api'
import { CatalogBondsModel } from '../db/models/catalog/bonds.js'
import { CatalogStocksModel } from '../db/models/catalog/stocks.js'
import { CatalogCurrenciesModel } from '../db/models/catalog/currencies.js'

const updateBonds = async (api) => {
  try {
    const bondsData = await CatalogBondsModel.find({})
    if (bondsData.length > 1) {
      console.log('Bonds data is already exist. ', bondsData.length)
      return
    }

    console.log('Updating bonds catalog...')

    const bonds = await api.instruments.bonds({})
    await Promise.all(bonds.instruments.map(async (item) => {
      const {
        name,
        figi,
        uid,
        ticker,
        isin,
        lot,
        currency,
        exchange,
        maturityDate,
        riskLevel
      } = item
      await new CatalogBondsModel({
        name,
        figi,
        uid,
        ticker,
        isin,
        lot,
        currency,
        exchange,
        maturityDate,
        riskLevel
      }).save()
    }))
    console.log('Done.')
  } catch (error) {
    console.log(error)
  }
}

const updateStocks = async (api) => {
  try {
    const stocksData = await CatalogStocksModel.find({})
    if (stocksData.length > 1) {
      console.log('Stocks data is already exist. ', stocksData.length)
      return
    }

    console.log('Updating stocks catalog...')

    const stocks = await api.instruments.shares({})
    await Promise.all(stocks.instruments.map(async (item) => {
      const {
        name,
        figi,
        uid,
        ticker,
        isin,
        lot,
        currency,
        exchange,
        riskLevel
      } = item
      await new CatalogStocksModel({
        name,
        figi,
        uid,
        ticker,
        isin,
        lot,
        currency,
        exchange,
        riskLevel
      }).save()
    }))
    console.log('Done.')
  } catch (error) {
    console.log(error)
  }
}

const updateCurrencies = async (api) => {
  try {
    const currenciesData = await CatalogCurrenciesModel.find({})
    if (currenciesData.length > 1) {
      console.log('Currencies data is already exist. ', currenciesData.length)
      return
    }

    console.log('Updating currencies catalog...')

    const currencies = await api.instruments.currencies({})
    await Promise.all(currencies.instruments.map(async (item) => {
      const {
        name,
        figi,
        uid,
        ticker,
        isin,
        lot,
        currency,
        exchange,
        riskLevel
      } = item
      await new CatalogCurrenciesModel({
        name,
        figi,
        uid,
        ticker,
        isin,
        lot,
        currency,
        exchange,
        riskLevel
      }).save()
    }))
    console.log('Done.')
  } catch (error) {
    console.log(error)
  }
}

export const updateCatalog = async () => {
  const token = credentials.tinkoff.token
  const api = new TinkoffInvestApi({ token })
  await updateBonds(api)
  await updateStocks(api)
  await updateCurrencies(api)
}
