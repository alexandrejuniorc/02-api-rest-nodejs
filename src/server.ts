import fastify from 'fastify'
import { knex } from './database'
import crypto from 'node:crypto'

const server = fastify()

server.get('/hello', async () => {
  // const transaction = await knex('transactions')
  //   .insert({
  //     amount: 555,
  //     id: crypto.randomUUID(),
  //     title: 'Transação de teste especifica',
  //   })
  //   .returning('*')
  // return transaction
  const transactions = await knex('transactions')
    .select('*')
    .where('amount', 555)
  return transactions
})

server
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running on port')
  })
