import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const server = fastify()

server.get('/hello', async () => {
  const transactions = await knex('transactions')
    .select('*')
    .where('amount', 555)
  return transactions
})

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running on port')
  })
