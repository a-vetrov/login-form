import mongoose from 'mongoose'
const { Schema } = mongoose

const stocksSchema = new Schema({
  name: String,
  figi: String,
  uid: String,
  ticker: String,
  isin: String,
  lot: Number,
  currency: String,
  realExchange: Number,
  riskLevel: Number,
  countryOfRiskName: String,
  sector: String,
  shareType: Number
})

export const CatalogStocksModel = mongoose.model('CatalogStocks', stocksSchema)
