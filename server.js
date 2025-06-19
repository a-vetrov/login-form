import fs from 'node:fs/promises'
import express from 'express'
import { initializeAPI } from './backend/api.js'
import { createDefaultUsers } from './backend/db.js'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'
import { redisStore } from './backend/db/redis.js'
import passport from 'passport'
import { updateCatalog } from './backend/utils/update-catalog.js'
import { credentials } from './credentials.js'
import { BotManager } from './backend/bots/bot-manager.js'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''

void createDefaultUsers()
void updateCatalog()

// Create http server
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(credentials.cookieSecret))

app.use(expressSession({
  secret: credentials.cookieSecret,
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  store: redisStore,
  cookie: { secure: false }
}))

app.use(passport.initialize())
app.use(passport.authenticate('session'))

initializeAPI(app)

// Create bot manager
const botManager = new BotManager()
void botManager.initialize()

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML
app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    /** @type {string} */
    let template
    /** @type {import('./src/entry-server.ts').render} */
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url)

    const html = template
      .replace('<!--app-head-->', rendered.head ?? '')
      .replace('<!--app-html-->', rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
