import mongoose from 'mongoose'
const { Schema } = mongoose

const intervalStepSchema = new Schema({
  min: Number,
  max: Number,
  state: String,
})

export const IntervalStepModel = mongoose.model('IntervalSteps', intervalStepSchema)
