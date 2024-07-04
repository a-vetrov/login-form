import express from 'express'
import { ensureLoggedIn } from '../handlers/ensure-logged-in.js'
import { getUserById, TokenType } from '../db/models/user.js'
import { sendError } from '../handlers/error.js'
// https://github.com/vitalets/tinkoff-invest-api
// https://tinkoff.github.io/investAPI/sandbox/
import { TinkoffInvestApi } from 'tinkoff-invest-api'
import { PortfolioRequest_CurrencyRequest } from 'tinkoff-invest-api/cjs/generated/operations.js'
import { getFirstRealToken, getFirstSandboxToken } from '../utils/tokens.js'
import { CatalogBondsModel } from '../db/models/catalog/bonds.js'
import { CatalogStocksModel } from '../db/models/catalog/stocks.js'
import { CatalogCurrenciesModel } from '../db/models/catalog/currencies.js'
import { catalogRouter } from './catalog.js'

export const tinkoffRouter = express.Router()

tinkoffRouter.get('/api/portfolio', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const token = getFirstRealToken(user)

    if (!token) {
      return sendError(res, 403, 'Ошибка', 'Не удалось найти подходящий токен')
    }

    const api = new TinkoffInvestApi({ token: token.token })

    const { accounts } = await api.users.getAccounts({})

    const portfolio = await api.operations.getPortfolio({
      accountId: accounts[0].id,
      currency: PortfolioRequest_CurrencyRequest.RUB
    })

    res.status(200).send({ success: true, data: { accounts, portfolio } })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

tinkoffRouter.get('/api/sandbox/accounts', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const token = getFirstSandboxToken(user)

    if (!token) {
      return sendError(res, 403, 'Ошибка', 'Не удалось найти подходящий токен')
    }

    const api = new TinkoffInvestApi({ token: token.token })

    const { accounts } = await api.sandbox.getSandboxAccounts({})

    res.status(200).send({ success: true, data: { accounts } })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

tinkoffRouter.post('/api/sandbox/accounts/create', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const token = getFirstSandboxToken(user)

    if (!token) {
      return sendError(res, 403, 'Ошибка', 'Не удалось найти подходящий токен')
    }

    const api = new TinkoffInvestApi({ token: token.token })

    const data = await api.sandbox.openSandboxAccount({})
    res.status(200).send({ success: true, data })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

tinkoffRouter.post('/api/sandbox/accounts/add-money', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const token = getFirstSandboxToken(user)

    if (!token) {
      return sendError(res, 403, 'Ошибка', 'Не удалось найти подходящий токен')
    }

    const api = new TinkoffInvestApi({ token: token.token })

    const amount = api.helpers.toMoneyValue(req.body.money, 'RUB')

    const data = await api.sandbox.sandboxPayIn({ accountId: req.body.id, amount })
    res.status(200).send({ success: true })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

tinkoffRouter.get('/api/sandbox/portfolio', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const token = getFirstSandboxToken(user)

    if (!token) {
      return sendError(res, 403, 'Ошибка', 'Не удалось найти подходящий токен')
    }
    const api = new TinkoffInvestApi({ token: token.token })

    const data = await api.sandbox.getSandboxPortfolio({ accountId: req.query.accountId, currency: PortfolioRequest_CurrencyRequest.RUB })
    res.status(200).send({ success: true, data })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

tinkoffRouter.delete('/api/sandbox/accounts/:id', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const token = getFirstSandboxToken(user)

    if (!token) {
      return sendError(res, 403, 'Ошибка', 'Не удалось найти подходящий токен')
    }

    const api = new TinkoffInvestApi({ token: token.token })

    const data = await api.sandbox.closeSandboxAccount({ accountId: req.params.id })
    res.status(200).send({ success: true })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

tinkoffRouter.post('/api/sandbox/post-order', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const token = getFirstSandboxToken(user)

    if (!token) {
      return sendError(res, 403, 'Ошибка', 'Не удалось найти подходящий токен')
    }

    const api = new TinkoffInvestApi({ token: token.token })

    const price = api.helpers.toQuotation(req.body.price)

    const body = {figi: '', ...req.body, price, accountId: req.body.account_id, orderType: req.body.order_type}

    console.log('Body !!!!!', body)

    const data = await api.sandbox.postSandboxOrder(body)
    res.status(200).send({ success: true, data })
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})


export const checkToken = async (token) => {
  let result
  const api = new TinkoffInvestApi({ token: token.token })
  if (token.type === TokenType.real) {
    result = await api.users.getAccounts({})
  } else {
    result = await api.sandbox.getSandboxAccounts()
  }
  return result !== null
}
