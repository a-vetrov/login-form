import express from 'express'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import { Strategy as YandexStrategy } from 'passport-yandex'
import crypto from 'crypto'
import { sendError } from '../handlers/error.js'
import { ensureLoggedIn } from '../handlers/ensure-logged-in.js'
import {
  createUserFromYandexOAuth,
  getUserByAuthId,
  getUserByEmail,
  getUserById,
  updateUserFromYandexOAuth
} from '../db/models/user.js'
import { credentials } from '../../credentials.js'

const checkPassword = (userInfo, password) => {
  const key = crypto.pbkdf2Sync(password, userInfo.salt, 100000, 64, 'sha512')
  return crypto.timingSafeEqual(userInfo.password, key)
}

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async function verify (email, password, cb) {
  const userInfo = await getUserByEmail(email)
  if (!userInfo || !checkPassword(userInfo, password)) {
    return cb(null, false, { message: 'Incorrect username or password.' })
  }
  return cb(null, userInfo)
}))

passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser((id, done) => {
  getUserById(id)
    .then(user => done(null, user))
    .catch(err => done(err, null))
})

export const authRouter = express.Router()

authRouter.post('/api/login', passport.authenticate('local', {
  failureMessage: true,
  successMessage: 'Success message'
}), function (req, res) {
  let data
  if (req.user) {
    const { name, email, role } = req.user
    data = { userInfo: { name, email, role } }
  }
  res.status(200).send({ success: true, data })
})

/* POST /logout
 *
 * This route logs the user out.
 */
authRouter.post('/api/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err) }
    res.redirect('/')
  })
})

/* GET /user-info
 *
 * This route returns user info if logged in.
 */
authRouter.get('/api/user-info', ensureLoggedIn, (req, res) => {
  if (req.user) {
    const { name, email, role } = res.req.user
    const data = { userInfo: { name, email, role } }
    res.status(200).send({ success: true, data })
  } else {
    sendError(res, 403, 'Ошибка', 'Неожиданная ошибка')
  }
})

// Yandex OAuth

passport.use(new YandexStrategy({ ...credentials.yandex },
  function (accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
    process.nextTick(async function () {
      let userInfo = await getUserByAuthId(profile.id)

      if (userInfo) {
        await updateUserFromYandexOAuth(profile)
      } else {
        userInfo = await createUserFromYandexOAuth(profile)
      }

      return done(null, userInfo)
    })
  }
))

authRouter.get('/auth/yandex',
  passport.authenticate('yandex'),
  function (req, res) {
    // The request will be redirected to Yandex for authentication, so this
    // function will not be called.
  })

authRouter.get('/auth/yandex/callback',
  passport.authenticate('yandex', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/')
  })
