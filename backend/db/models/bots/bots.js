import mongoose from 'mongoose'
const { Schema } = mongoose

export const BotsType = {
  interval: 'interval'
}

const botsSchema = new Schema({
  type: String,
  userId: { type: Schema.Types.ObjectId, ref: 'UserModel' },
  created: Date,
  accountType: String,
  selectedAccount: String,
  properties: {
    type: Map,
    of: {}
  }
})

export const BotsModel = mongoose.model('Bots', botsSchema)

export const getBotsByUserId = async (userId) => BotsModel.find({ userId })

export const getBotById = async (id) => BotsModel.findById(id)
