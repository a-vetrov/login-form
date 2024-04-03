import express from 'express'
import { sendError } from './handlers/error.js'
import {authRouter} from "./routes/auth.js";
import {brokerRouter} from "./routes/broker.js";
import {tinkoffRouter} from "./routes/tinkoff.js";
import {catalogRouter} from "./routes/catalog.js";

const router = express.Router()

router.post('/api/register', (req, res) => {
  sendError(res, 403, 'Уходите', 'Вам здесь не рады')
})

router.all('/api/*', (req, res) => {
  sendError(res, 404, 'API route not found')
})

export const initializeAPI = (app) => {
  app.use(authRouter)
  app.use(brokerRouter)
  app.use(tinkoffRouter)
  app.use(catalogRouter)
  app.use(router)
}
