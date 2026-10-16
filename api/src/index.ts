import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { getEnv } from './infra/env.js'
import sql from './infra/db.js'
import { authConfig } from './auth/config/jwt.js'
import { passwordHasher } from './auth/password/passwordHasher.js'
import { createSQLAccountRepository } from './auth/repository/accountRepository.js'
import { createSQLRefreshTokenRepository } from './auth/repository/refreshTokenRepository.js'
import { createRegisterService } from './auth/register/registerService.js'
import { createAuthRoutes } from './auth/route/route.js'
import { createSessionRoutes } from './auth/route/sessionRoutes.js'
import { createSessionService } from './auth/session/sessionService.js'
import { createSQLTimelineRepository } from './timeline/list/repository.js'
import { createTimelineService } from './timeline/list/timelineService.js'
import { createTimelineRoutes } from './timeline/route/route.js'
import { handleUnexpectedError } from './common/http/handleUnexpectedError.js'

const { PORT, JWT_SECRET } = getEnv()

const accountRepository = createSQLAccountRepository(sql)

const registerService = createRegisterService({
  repository: accountRepository,
  hashPassword: passwordHasher.hash,
})
const sessionService = createSessionService({
  accountRepository,
  refreshTokenRepository: createSQLRefreshTokenRepository(sql),
  verifyPassword: passwordHasher.verify,
  jwtSecret: JWT_SECRET,
})
const timelineService = createTimelineService({
  repository: createSQLTimelineRepository(sql),
})

const AUTH_MOUNT_PATH = authConfig.refreshTokenCookiePath

const app = new Hono()

app.onError(handleUnexpectedError)

app.get('/api/health', (c) => {
  return c.json({ status: 'ok' })
})

app.route(AUTH_MOUNT_PATH, createAuthRoutes(registerService))
app.route(AUTH_MOUNT_PATH, createSessionRoutes({ sessionService, jwtSecret: JWT_SECRET }))
app.route('/api/timeline', createTimelineRoutes({ timelineService }))

serve({
  fetch: app.fetch,
  port: Number(PORT)
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
