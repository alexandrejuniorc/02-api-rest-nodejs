import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function transactionsRoutes(server: FastifyInstance) {
  server.get('/', async (request, response) => {
    const transactions = await knex('transactions').select()

    return { transactions }
  })

  server.get('/:id', async (request, response) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions').where('id', id).first()

    return { transaction }
  })

  server.get('/summary', async (request, response) => {
    // no knex o retorno sempre vai ser um array à não ser que o first vá no final da query
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' }) // "as" renomeia o nome da propriedade
      .first()

    return { summary }
  })

  server.post('/', async (request, response) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { amount, title, type } = createTransactionBodySchema.parse(
      request.body,
    )

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return response.status(201).send({ success: true })
  })
}
