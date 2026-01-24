import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { getEnv } from './infra/env.js'
import { timelineRoutes } from './timeline/route/route.js'

const app = new Hono()

app.get('/api/health', (c) => {
  return c.json({ status: 'ok' })
})

app.route('/api/timeline', timelineRoutes)

const { PORT } = getEnv()

serve({
  fetch: app.fetch,
  port: Number(PORT)
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
