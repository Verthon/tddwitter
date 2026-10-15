import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import bcrypt from 'bcrypt'

import { getEnv } from './infra/env.js'
import sql from './infra/db.js'
import { createSQLAccountRepository } from './auth/repository/accountRepository.js'
import { createRegisterService } from './auth/register/registerService.js'
import { createAuthRoutes } from './auth/route/route.js'
import { createSQLTimelineRepository } from './timeline/list/repository.js'
import { createTimelineService } from './timeline/list/timelineService.js'
import { createTimelineRoutes } from './timeline/route/route.js'
import { handleUnexpectedError } from './common/http/handleUnexpectedError.js'

const registerService = createRegisterService({
  repository: createSQLAccountRepository(sql),
  hashPassword: (password) => bcrypt.hash(password, 10),
})
const timelineService = createTimelineService({
  repository: createSQLTimelineRepository(sql),
})

const app = new Hono()

app.onError(handleUnexpectedError)

app.get('/api/health', (c) => {
  return c.json({ status: 'ok' })
})

app.route('/api/auth', createAuthRoutes(registerService))
app.route('/api/timeline', createTimelineRoutes({ timelineService }))

const { PORT } = getEnv()

serve({
  fetch: app.fetch,
  port: Number(PORT)
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
