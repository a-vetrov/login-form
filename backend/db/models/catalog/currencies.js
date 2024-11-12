import mongoose from 'mongoose'
import { MoneyValueSchema } from './money.js'
const { Schema } = mongoose

const currenciesSchema = new Schema({
  name: String,
  figi: String,
  uid: String,
  ticker: String,
  isin: String,
  lot: Number,
  currency: String,
  realExchange: String,
  riskLevel: Number,
  nominal: MoneyValueSchema
})

export const CatalogCurrenciesModel = mongoose.model('CatalogCurrencies', currenciesSchema)
