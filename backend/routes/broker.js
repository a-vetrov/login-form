import express from "express";
import {ensureLoggedIn} from "../handlers/ensure-logged-in.js";
import {getUserById} from "../db/models/user.js";
import {sendError} from "../handlers/error.js";

export const brokerRouter = express.Router();

/* GET /broker/list
 *
 * This route returns the list of broker items.
 */
brokerRouter.get('/api/broker/list', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const data = user.tokens.map((item, index) => ({name: item.name, created: item.created, id: item._id}))

    res.status(200).send({ success: true, data });
  } catch (error) {
    sendError(res, 403, 'Ошибка', 'Что-то пошло не так')
  }
})

/* PUT /api/broker
 *
 * This route adds token for current user.
 */
brokerRouter.put('/api/broker', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const {name, token} = req.body
    if (!name || !token) {
      sendError(res, 403, 'Ошибка', 'Некорректные данные')
      return
    }
    const newTokenItem = {
      created: new Date(),
      name,
      token
    }
    user.tokens.push(newTokenItem)
    await user.save()
    res.status(200).send({ success: true });
  } catch (e) {
    sendError(res, 403, 'Ошибка', 'Добавить токен не удалось')
  }
})

/* DELETE /api/broker
 *
 * This route deletes token from the token list for current user.
 */
brokerRouter.delete('/api/broker', ensureLoggedIn, async (req, res) => {
  try {
    const user = await getUserById(req.user._id)
    const {id} = req.body
    if (!id) {
      sendError(res, 403, 'Ошибка', 'Некорректные данные')
      return
    }

    user.tokens.pull({ _id: id })
    await user.save()
    res.status(200).send({ success: true });
  } catch (e) {
    console.log(e)
    sendError(res, 403, 'Ошибка', 'Удалить токен не удалось')
  }
})
