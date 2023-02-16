import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const server = fastify()

server.register(transactionsRoutes, {
  prefix: 'transactions',
})

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running on port')
  })
