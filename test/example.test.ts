import { expect, test } from 'vitest'

test('O usuário consegue criar uma nova transação', () => {
  // Fazer a chamada HTTP p/ criar uma nova transação
  // Validação
  const responseStatusCode = 201
  expect(responseStatusCode).toEqual(201)
})
