import mongoose from 'mongoose'
const { Schema } = mongoose

/** Денежная сумма в определенной валюте */
export const MoneyValueSchema = new Schema({
  currency: String,
  units: Number,
  nano: Number
})

export const QuotationSchema = new Schema({
  units: Number,
  nano: Number
})
