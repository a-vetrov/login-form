import mongoose from 'mongoose'
import { QuotationSchema } from './money.js'
const { Schema } = mongoose

const futuresSchema = new Schema({
  name: String,
  figi: String,
  uid: String,
  ticker: String,
  lot: Number,
  currency: String,
  realExchange: Number,
  countryOfRiskName: String,
  futuresType: String,
  assetType: String,
  basicAsset: String,
  basicAssetSize: QuotationSchema,
  sector: String,
  expirationDate: String,
  minPriceIncrement: Number
})

export const CatalogFuturesModel = mongoose.model('CatalogFutures', futuresSchema)
