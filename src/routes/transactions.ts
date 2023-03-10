import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { CheckSessionIdExists } from '../middlewares/check-session-id-exists'

//  Unitários: unidade da sua aplicação
//  Integração: comunicação entre duas ou mais unidades
//  e2e - ponta a ponta: simulam um usuário operando na nossa aplicação

//  front-end: abre a página de login, digite o texto ale@rocketseat.com no campo ID email, clique no botão ....
//  back-end: chamadas HTTP, websockets

// Pirâmide de testes: E2E (Não dependem de nenhuma tecnologia, não dependem de arquitetura)

export async function transactionsRoutes(server: FastifyInstance) {
  server.get(
    '/',
    { preHandler: [CheckSessionIdExists] },
    async (request, response) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      return { transactions }
    },
  )

  server.get(
    '/:id',
    { preHandler: [CheckSessionIdExists] },
    async (request, response) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const transaction = await knex('transactions')
        .where({ session_id: sessionId, id })
        .first()

      return { transaction }
    },
  )

  server.get(
    '/summary',
    { preHandler: [CheckSessionIdExists] },
    async (request, response) => {
      const { sessionId } = request.cookies

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )

  server.post('/', async (request, response) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { amount, title, type } = createTransactionBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      response.cookie('sessionId', sessionId, {
        path: '/transactions',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return response.status(201).send({ success: true })
  })
}
