import 'dotenv/config'

import { z } from 'zod'

// schema de validação para todas as variáveis de ambiente

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

const _env = envSchema.safeParse(process.env) // parse dispara um erro automaticamente

if (_env.success === false) {
  console.error('Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data