import mongoose from 'mongoose'
const { Schema } = mongoose

export const BotsType = {
  interval: 'interval'
}

const intervalStepSchema = new Schema({
  state: String,
  serialNumber: Number,
  min: Number,
  max: Number,
  botId: { type: Schema.Types.ObjectId, ref: 'BotsModel' },
  orders: [String]
})

export const IntervalStepModel = mongoose.model('IntervalSteps', intervalStepSchema)

export const getBotSteps = async (botId) => {
  return IntervalStepModel.find({ botId })
}
