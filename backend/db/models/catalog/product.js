import mongoose from 'mongoose'
const { Schema } = mongoose

export const productSchema = new Schema({
  name: String,
  figi: String,
  uid: String,
  ticker: String,
  isin: String,
  type: String
})

export const ProductModel = mongoose.model('CatalogProduct', productSchema)
