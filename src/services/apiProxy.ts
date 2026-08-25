import { supabase, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";

export type ProviderName = "fal" | "runware" | "reve";

interface ProxyRequest {
  provider: ProviderName;
  path: string;
  method?: "GET" | "POST";
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Calls the third-party image generation provider via the `api-proxy` Edge
 * Function, so the real provider API key never reaches the browser bundle.
 * Requires a signed-in Supabase session; the returned Response mirrors the
 * upstream provider's response (status, headers, body) so callers can keep
 * using their existing JSON/binary parsing logic unchanged.
 */
export async function callProviderProxy(req: ProxyRequest): Promise<Response> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You must be signed in to generate images.");
  }

  return fetch(`${SUPABASE_URL}/functions/v1/api-proxy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      apikey: SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify(req),
  });
}
