import mongoose from 'mongoose'
import {UserModel} from "../user.js";
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

export const getBotsByUserById = async (userId) => BotsModel.find({ userId })
