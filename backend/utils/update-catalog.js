import { TinkoffInvestApi } from 'tinkoff-invest-api'
import { CatalogBondsModel } from '../db/models/catalog/bonds.js'
import { CatalogStocksModel } from '../db/models/catalog/stocks.js'
import { CatalogCurrenciesModel } from '../db/models/catalog/currencies.js'
import { CatalogFuturesModel } from '../db/models/catalog/futures.js'
import { credentials } from '../../credentials.js'
import { isProduction } from '../config.js'

const updateBonds = async (api) => {
  try {
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
        realExchange,
        maturityDate,
        riskLevel,
        countryOfRiskName,
        sector,
        couponQuantityPerYear,
        nominal,
        aciValue
      } = item
      const doc = await CatalogBondsModel.findOneAndUpdate({ isin }, {
        name,
        figi,
        uid,
        ticker,
        isin,
        lot,
        currency,
        realExchange,
        maturityDate,
        riskLevel,
        countryOfRiskName,
        sector,
        couponQuantityPerYear,
        nominal,
        aciValue
      },
      {
        new: true,
        upsert: true // Make this update into an upsert
      })
      await doc.save()
    }))
    console.log('Done.')
  } catch (error) {
    console.log(error)
  }
}

const updateStocks = async (api) => {
  try {
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
        realExchange,
        riskLevel,
        countryOfRiskName,
        sector,
        shareType,
        nominal
      } = item
      const doc = await CatalogStocksModel.findOneAndUpdate({ isin }, {
        name,
        figi,
        uid,
        ticker,
        isin,
        lot,
        currency,
        realExchange,
        riskLevel,
        countryOfRiskName,
        sector,
        shareType,
        nominal
      }, {
        new: true,
        upsert: true // Make this update into an upsert
      })
      await doc.save()
    }))
    console.log('Done.')
  } catch (error) {
    console.log(error)
  }
}

const updateCurrencies = async (api) => {
  try {
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
        realExchange,
        riskLevel
      } = item
      const doc = await CatalogCurrenciesModel.findOneAndUpdate({ ticker }, {
        name,
        figi,
        uid,
        ticker,
        isin,
        lot,
        currency,
        realExchange,
        riskLevel
      }, {
        new: true,
        upsert: true // Make this update into an upsert
      })
      await doc.save()
    }))
    console.log('Done.')
  } catch (error) {
    console.log(error)
  }
}

const updateFutures = async (api) => {
  try {
    console.log('Updating Futures catalog...')

    const futures = await api.instruments.futures({})
    await Promise.all(futures.instruments.map(async (item) => {
      const {
        name,
        figi,
        uid,
        ticker,
        lot,
        currency,
        realExchange,
        countryOfRiskName,
        futuresType,
        assetType,
        basicAsset,
        basicAssetSize,
        sector,
        expirationDate
      } = item
      const doc = await CatalogFuturesModel.findOneAndUpdate({ ticker }, {
        name,
        figi,
        uid,
        ticker,
        lot,
        currency,
        realExchange,
        countryOfRiskName,
        futuresType,
        assetType,
        basicAsset,
        basicAssetSize,
        sector,
        expirationDate
      }, {
        new: true,
        upsert: true // Make this update into an upsert
      })
      await doc.save()
    }))
    console.log('Done.')
  } catch (error) {
    console.log(error)
  }
}

export const updateCatalog = async () => {
  if (!isProduction()) {
    const bondsLength = await CatalogBondsModel.countDocuments()
    if (bondsLength) {
      return
    }
  }

  const token = credentials.tinkoff.token
  const api = new TinkoffInvestApi({ token })
  await updateBonds(api)
  await updateStocks(api)
  await updateCurrencies(api)
  await updateFutures(api)
}
