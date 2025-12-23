import { WebSocketServer } from 'ws'
import passport from 'passport'
import expressSession from 'express-session'
import { credentials } from '../credentials.js'
import { redisStore } from './db/redis.js'

const map = new Map()

function onSocketError (err) {
  console.error(err)
}

const authenticateByPassport = ({ req }, done) => {
  const onFinish = (request) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      done(false, 401, 'Unauthorized: Access denied')
    } else {
      done(true)
    }
  }

  const onSession = () => {
    passport.authenticate('session')(req, {}, onFinish)
  }

  expressSession({
    secret: credentials.cookieSecret,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    store: redisStore,
    cookie: { secure: false }
  })(req, {}, onSession)
}

export const startWebsocket = (app, server) => {
  console.log('startWebsocket !!!!!!')

  const wss = new WebSocketServer({
    server,
    verifyClient: authenticateByPassport
  })

  wss.on('connection', function (ws, request) {
    const userId = request?.user?._id

    if (!userId) {
      return
    }

    console.log('map.get(userId)', userId, map.get(userId))

    map.get(userId)?.terminate()

    map.set(userId, ws)

    ws.on('error', onSocketError)

    ws.on('message', function (message) {
      //
      // Here we can now use session parameters.
      //
      console.log(`Received message ${message} from user ${userId}`)

      setTimeout(function () {
        ws.send((new Date().toLocaleString()))
      }, 3000)
    })

    ws.on('close', function () {
      map.delete(userId)
    })
  })
}
