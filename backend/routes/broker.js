import express from "express";
import {ensureLoggedIn} from "../handlers/ensure-logged-in.js";

export const brokerRouter = express.Router();

/* GET /broker/list
 *
 * This route returns the list of broker items.
 */
brokerRouter.get('/api/broker/list', ensureLoggedIn, (req, res) => {
  res.status(200).send({ success: true, data: [] });

})
