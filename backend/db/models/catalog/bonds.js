import mongoose from 'mongoose'
import { MoneyValueSchema } from './money.js'
const { Schema } = mongoose

const bondsSchema = new Schema({
  name: String,
  figi: String,
  uid: String,
  ticker: String,
  isin: String,
  lot: Number,
  currency: String,
  realExchange: Number,
  maturityDate: Date,
  riskLevel: Number,
  countryOfRiskName: String,
  sector: String,
  couponQuantityPerYear: Number,
  nominal: MoneyValueSchema,
  aciValue: MoneyValueSchema
})

export const CatalogBondsModel = mongoose.model('CatalogBonds', bondsSchema)
