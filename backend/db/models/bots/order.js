import mongoose from 'mongoose'
const { Schema } = mongoose

const orderSchema = new Schema({
  orderId: String,
  status: Number,
  direction: Number,
  properties: {
    type: Map,
    of: {}
  }
})

export const OrdersModel = mongoose.model('Orders', orderSchema)
