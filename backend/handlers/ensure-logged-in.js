import {sendError} from "./error.js";

export const ensureLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    sendError(res, 401, 'Ошибка авторизации', 'Вы не авторизованы')
  }
  else {
    next()
  }
}
