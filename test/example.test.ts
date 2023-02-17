import { expect, test, beforeAll, afterAll } from 'vitest'
import { server as app } from '../src/app'
import supertest from 'supertest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

test('User can create a new transaction', async () => {
  const response = await supertest(app.server).post('/transactions').send({
    title: 'New transaction',
    amount: 5000,
    type: 'credit',
  })

  expect(response.statusCode).toEqual(201)
})
