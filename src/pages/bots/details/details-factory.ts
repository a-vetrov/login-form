import { BotsType } from '../../../constants'
import { IntervalBotDetails } from './interval-bot'

export const getBotDetailsView = (type: BotsType) => {
  switch (type) {
    case BotsType.interval: return IntervalBotDetails

    default: return null
  }
}
