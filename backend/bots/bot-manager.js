export class BotManager {
  static instance
  #bots = {}

  constructor () {
    if (BotManager.instance) {
      return BotManager.instance
    }
    BotManager.instance = this

    Object.freeze(this)
    console.log('Bot manager created!')
  }

  initialize () {
    console.log('Bot manager initialized!')
  }

  addBot (newBot) {
    this.#bots[newBot.id] = newBot
  }

  getBotById (id) {
    return this.#bots[id]
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
  }
}
