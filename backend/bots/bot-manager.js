import { getAllActiveBots } from '../db/models/bots/bots.js'
import { getUserById } from '../db/models/user.js'
import { getFirstRealToken, getFirstSandboxToken } from '../utils/tokens.js'
import { IntervalBot } from './interval/interval-bot.js'
import { forEachSeries } from '../utils/promise.js'

export class BotManager {
  static instance
  #bots = new Map()

  constructor () {
    if (BotManager.instance) {
      return BotManager.instance
    }
    BotManager.instance = this

    Object.freeze(this)
  }

  createBotFromDB = async (bot) => {
    try {
      let botInstance = null
      const user = await getUserById(bot.userId)
      const token = bot.accountType === 'real' ? getFirstRealToken(user) : getFirstSandboxToken(user)

      if (bot.type === 'interval') {
        botInstance = new IntervalBot({
          token,
          account: bot.selectedAccount,
          product: bot.properties.get('product'),
          bounds: bot.properties.get('bounds'),
          stepsCount: bot.properties.get('stepsCount'),
          stepProfit: bot.properties.get('stepProfit'),
          amountPerStep: bot.properties.get('amountPerStep'),
          id: bot._id.toString()
        })

        await botInstance.updateStepsFromDB()
      }

      if (botInstance) {
        this.addBot(botInstance)
        botInstance.start()
      }
    } catch (e) {
      console.log('createBotFromDB ERROR!!!!', e)
      bot.active = false
      await bot.save()
    }
  }

  async initialize () {
    const bots = await getAllActiveBots()
    await forEachSeries(bots, this.createBotFromDB)
    console.log('Bot manager initialized!')
  }

  addBot (newBot) {
    this.#bots.set(newBot.id, newBot)
  }

  getBotById (id) {
    return this.#bots.get(id)
  }

  getBotInfo (id) {
    const bot = this.getBotById(id)
    if (!bot || !bot.getInfo) {
      return null
    }
    return bot.getInfo()
  }

  stopBot (id) {
    const bot = this.getBotById(id)
    if (bot) {
      bot.stop()
    }
    this.#bots.delete(id)
  }
}
