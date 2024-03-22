import express from "express";
import {ensureLoggedIn} from "../handlers/ensure-logged-in.js";
import {getUserById} from "../db/models/user.js";
import {sendError} from "../handlers/error.js";
import {brokerRouter} from "./broker.js";
import {TinkoffInvestApi} from "tinkoff-invest-api";
import {PortfolioRequest_CurrencyRequest} from "tinkoff-invest-api/cjs/generated/operations.js";

export const tinkoffRouter = express.Router();

brokerRouter.get('/api/portfolio', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const token = user.tokens[0].token

    const api = new TinkoffInvestApi({ token });
    const { accounts } = await api.users.getAccounts({});

    const portfolio = await api.operations.getPortfolio({
      accountId: accounts[0].id,
      currency: PortfolioRequest_CurrencyRequest.RUB
    });

    console.log('Accounts!!!!', accounts)
    console.log('Portfolio!!!!', portfolio)

    res.status(200).send({ success: true, data: {accounts, portfolio} });
  } catch (error) {
    sendError(res, 403, 'Ошибка', 'Что-то пошло не так')
  }
})
