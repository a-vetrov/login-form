import { WebSocketServer } from 'ws'
import passport from 'passport'
import expressSession from 'express-session'
import { credentials } from '../credentials.js'
import { redisStore } from './db/redis.js'
import { SocketMessageType } from './enums/SocketMessageType.js'

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

export const startWebsocket = (server) => {
  const wss = new WebSocketServer({
    server,
    verifyClient: authenticateByPassport
  })

  wss.on('connection', (ws, request) => {
    const userId = request?.user?._id.toString()

    if (!userId) {
      return
    }

    map.get(userId)?.terminate()

    map.set(userId, ws)

    ws.currentBot = null

    ws.on('error', onSocketError)

    ws.on('message', (message) => {
      //
      // Here we can now use session parameters.
      //
      try {
        const data = JSON.parse(message)
        if (data.type === SocketMessageType.SET_CURRENT_BOT) {
          ws.currentBot = data.botId || null
        }
        console.log(`Received message ${message} from user ${userId}`)
      } catch (e) {
        console.log(`User: ${userId} Error parsing message ${message}: `, e)
      }
    })

    ws.on('close', () => {
      map.delete(userId)
    })
  })

  console.log('Websocket started')
}

export const sendSocketMessage = (userId, type, data) => {
  const ws = map.get(userId.toString())

  if (!ws) {
    return
  }

  if (data.botId && data.botId === ws.currentBot) {
    const message = JSON.stringify({ type, data })
    ws.send(message)
  }
}
