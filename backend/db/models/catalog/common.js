// import { CatalogBondsModel } from './bonds.js'
import { CatalogStocksModel } from './stocks.js'
// import { CatalogCurrenciesModel } from './currencies.js'
import { CatalogFuturesModel } from './futures.js'

export const getInstrumentByIsin = async (isin) => {
  let type = 'stock'
  let data = await CatalogStocksModel.findOne({ isin }).lean()
  /* Пока отключим бонды и валюту
  if (!data) {
    type = 'bond'
    data = await CatalogBondsModel.findOne({ isin }).lean()
  }
  if (!data) {
    type = 'currency'
    data = await CatalogCurrenciesModel.findOne({ ticker: isin }).lean()
  }

   */
  if (!data) {
    type = 'future'
    data = await CatalogFuturesModel.findOne({ ticker: isin }).lean()
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
  let type = 'stock'
  let data = await CatalogStocksModel.findOne({ uid }).lean()

  /* Пока отключим бонды и валюту
  if (!data) {
    type = 'bond'
    data = await CatalogBondsModel.findOne({ uid }).lean()
  }
  if (!data) {
    type = 'currency'
    data = await CatalogCurrenciesModel.findOne({ uid }).lean()
  }
   */

  if (!data) {
    type = 'future'
    data = await CatalogFuturesModel.findOne({ uid }).lean()
  }

  if (!data) {
    return null
  }

  const {
    isin, figi, name, lot, minPriceIncrement
  } = data

  return { isin, figi, uid, name, type, lot, minPriceIncrement }
}
