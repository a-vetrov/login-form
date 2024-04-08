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
  exchange: String,
  riskLevel: Number
})

export const CatalogStocksModel = mongoose.model('CatalogStocks', stocksSchema)
