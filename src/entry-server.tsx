import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { App } from './App'
import { addSlash } from './utils/url.ts'

export function render (url: string) {
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={addSlash(url)}>
      <App />
    </StaticRouter>
  )
  return { html }
}
