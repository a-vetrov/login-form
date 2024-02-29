import express from 'express'
import { sendError } from './handlers/error.js'

const router = express.Router()

router.post('/api/register', (req, res) => {
  sendError(res, 403, 'Уходите', 'Вам здесь не рады')
})

export default router
