import mongoose from 'mongoose'
const { Schema } = mongoose

export const productSchema = new Schema({
  name: String,
  figi: String,
  uid: String,
  ticker: String,
  isin: String,
  type: String,
  lot: Number,
  minPriceIncrement: Number,
  minPriceIncrementAmount: Number,
  initialMarginOnBuy: Number,
  initialMarginOnSell: Number
})

export const ProductModel = mongoose.model('CatalogProduct', productSchema)
