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
  active: Boolean,
  properties: {
    type: Map,
    of: {}
  }
})

export const BotsModel = mongoose.model('Bots', botsSchema)

export const getBotsByUserId = async (userId) => BotsModel.find({ userId })

export const getBotById = async (id) => BotsModel.findById(id)

export const updateBotProperties = async (id, properties) => {
  try {
    console.log('updateBotProperties', id)
    const bot = await getBotById(id)

    Object.keys(properties).forEach((key) => {
      bot.properties.set(key, properties[key])
    })
    bot.save()
  } catch (e) {
    console.log('Не получилось обновить свойства бота', id, e)
  }
}
