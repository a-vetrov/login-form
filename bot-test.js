import { IntervalBot } from './backend/bots/interval/interval-bot.js'

const params = {
  token: {
    token: 't.BwNZ6c6YR0kczcfnJ8sQPXlt2cgdI1ENcwxT7qfjHSU6QOd_-3kFS0xWTzhHjlZQrrS4DE0anbcUscExPf9zOA',
    name: '1',
    type: 'real',
    created: '2024-12-05T10:20:52.902Z'
  },
  account: 'e38f42f5-868e-408d-84fa-2b284030b23a',
  product: {
    isin: 'RU0009029540',
    figi: 'BBG004730N88',
    uid: 'e6123145-9665-43e0-8413-cd61b8aa9b13',
    name: 'Сбер Банк',
    type: 'stock'
  },
  bounds: { min: 229, max: 231 },
  stepsCount: 10,
  amountPerStep: 1,
  id: '67517f97afa8c181f4c97a06'
}

const bot = new IntervalBot(params)
