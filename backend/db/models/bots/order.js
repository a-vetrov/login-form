import mongoose from 'mongoose'
const { Schema } = mongoose

const orderSchema = new Schema({
  orderId: String,
  botId: { type: Schema.Types.ObjectId, ref: 'BotsModel' },
  status: Number,
  direction: Number,
  properties: {
    type: Map,
    of: {}
  }
})

export const OrdersModel = mongoose.model('Orders', orderSchema)
