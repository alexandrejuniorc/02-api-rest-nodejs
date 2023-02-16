import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const server = fastify()

server.register(transactionsRoutes)

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running on port')
  })
