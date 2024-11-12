import { CatalogBondsModel } from './bonds.js'
import { CatalogStocksModel } from './stocks.js'
import { CatalogCurrenciesModel } from './currencies.js'

export const getInstrumentByIsin = async (isin) => {
  let type = 'bond'
  let data = await CatalogBondsModel.findOne({ isin }).lean()
  if (!data) {
    type = 'stock'
    data = await CatalogStocksModel.findOne({ isin }).lean()
  }
  if (!data) {
    type = 'currency'
    data = await CatalogCurrenciesModel.findOne({ ticker: isin }).lean()
  }

  if (!data) {
    return null
  }

  const {
    _id, __v, ...rest
  } = data

  rest.type = type

  return rest
}

export const getInstrumentByUid = async (uid) => {
  let type = 'bond'
  let data = await CatalogBondsModel.findOne({ uid }).lean()
  if (!data) {
    type = 'stock'
    data = await CatalogStocksModel.findOne({ uid }).lean()
  }
  if (!data) {
    type = 'currency'
    data = await CatalogCurrenciesModel.findOne({ uid }).lean()
  }

  if (!data) {
    return null
  }

  const {
    isin, figi, name
  } = data

  return { isin, figi, uid, name, type }
}
