import express from "express";
import {ensureLoggedIn} from "../handlers/ensure-logged-in.js";
import {getUserById, TokenType} from "../db/models/user.js";
import {sendError} from "../handlers/error.js";
// https://github.com/vitalets/tinkoff-invest-api
import {TinkoffApiError, TinkoffInvestApi} from "tinkoff-invest-api";
import {PortfolioRequest_CurrencyRequest} from "tinkoff-invest-api/cjs/generated/operations.js";

export const tinkoffRouter = express.Router();

tinkoffRouter.get('/api/portfolio', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const token = user.tokens[0].token

    const api = new TinkoffInvestApi({ token });

    const {accounts } = await api.users.getAccounts({});

    const portfolio = await api.operations.getPortfolio({
      accountId: accounts[0].id,
      currency: PortfolioRequest_CurrencyRequest.RUB
    });

    res.status(200).send({ success: true, data: {accounts, portfolio} });
  } catch (error) {
    console.log('error', error)
    sendError(res, 403, 'Ошибка', error.details ?? 'Что-то пошло не так')
  }
})

export const checkToken = async (token) => {
  let result;
  const api = new TinkoffInvestApi({ token: token.token });
  if (token.type === TokenType.real) {
    result = await api.users.getAccounts({});
  } else {
    result = await api.sandbox.getSandboxAccounts();
  }
  return result !== null
}
