import mongoose from 'mongoose'
const { Schema } = mongoose

const bondsSchema = new Schema({
  name: String,
  figi: String,
  uid: String,
  ticker: String,
  isin: String,
  lot: Number,
  currency: String,
  exchange: String,
  maturityDate: Date,
  riskLevel: Number
})

export const CatalogBondsModel = mongoose.model('CatalogBonds', bondsSchema)
