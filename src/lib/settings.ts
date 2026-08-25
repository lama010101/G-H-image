import { z } from 'zod'

// Provider API keys (Fal, Runware, Reve) are held server-side as Edge
// Function secrets and reached via the `api-proxy` function -- they are
// intentionally not read here, so they never end up in the client bundle.
const reveSchema = z.object({
  endpointPath: z.string().min(1, 'Missing VITE_REVE_ENDPOINT_PATH'),
  accept: z.string().min(1, 'Missing VITE_REVE_ACCEPT').default('application/json'),
})

const legacySchema = z.object({
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_URL: z.string().optional(),
})

export type Settings = z.infer<typeof legacySchema>

export const settings: Settings = legacySchema.parse(import.meta.env)

export const getReveConfig = () => {
  const config = reveSchema.safeParse({
    endpointPath: import.meta.env.VITE_REVE_ENDPOINT_PATH ?? '/v1/image/create',
    accept: (import.meta.env.VITE_REVE_ACCEPT ?? 'application/json').toLowerCase(),
  })

  if (!config.success) {
    if (import.meta.env.PROD) throw config.error
    console.error(config.error)
  }

  return config.data
}
