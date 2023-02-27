import { config } from 'dotenv'

import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({
    path: '.env.test',
  })
} else {
  config()
}
// schema de validação para todas as variáveis de ambiente

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333), // coerce transforma o valor em um número e se isso não retornar um valor válido irá retornar o padrão
})

const _env = envSchema.safeParse(process.env) // parse dispara um erro automaticamente

if (_env.success === false) {
  console.error('Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
