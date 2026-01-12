import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  MONGODB_URI: z.string().optional(),
  MONGODB_DB_NAME: z.string().default('myapp'),
})

export const env = envSchema.parse(process.env)

export type Env = z.infer<typeof envSchema>
