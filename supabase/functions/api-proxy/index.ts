// Server-side proxy for third-party image generation providers (Fal.ai,
// Runware, Reve). Provider API keys live only as Edge Function secrets here
// and are never sent to the browser. Only authenticated app users may call
// this function; requests are forwarded to the target provider with the
// real key attached, and the raw upstream response (status, headers, body)
// is streamed back unchanged so existing client-side parsing logic keeps
// working without modification.
//
// Required secrets (set via `supabase secrets set` or the dashboard):
//   FAL_API_KEY, RUNWARE_API_KEY, REVE_API_KEY
// Optional: REVE_API_BASE (defaults to https://api.reve.com)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ProviderName = "fal" | "runware" | "reve";

interface ProviderConfig {
  baseUrl: string;
  secretEnv: string;
  authHeader: (apiKey: string) => Record<string, string>;
}

const PROVIDERS: Record<ProviderName, ProviderConfig> = {
  fal: {
    baseUrl: "https://queue.fal.run",
    secretEnv: "FAL_API_KEY",
    authHeader: (key) => ({ Authorization: `Key ${key}` }),
  },
  runware: {
    baseUrl: "https://api.runware.ai",
    secretEnv: "RUNWARE_API_KEY",
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
  },
  reve: {
    baseUrl: Deno.env.get("REVE_API_BASE") ?? "https://api.reve.com",
    secretEnv: "REVE_API_KEY",
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
  },
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "Missing Authorization header" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    return json({ error: "Unauthorized" }, 401);
  }

  let payload: {
    provider?: ProviderName;
    path?: string;
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
  };

  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { provider, path, method = "POST", body, headers: extraHeaders } = payload;

  if (!provider || !(provider in PROVIDERS)) {
    return json({ error: `Unknown provider: ${provider}` }, 400);
  }
  if (!path) {
    return json({ error: "Missing path" }, 400);
  }

  const config = PROVIDERS[provider];
  const apiKey = Deno.env.get(config.secretEnv);
  if (!apiKey) {
    return json({ error: `${config.secretEnv} is not configured on the server` }, 500);
  }

  const targetUrl = path.startsWith("http")
    ? path
    : `${config.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  try {
    const upstream = await fetch(targetUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...config.authHeader(apiKey),
        ...(extraHeaders ?? {}),
      },
      body: method.toUpperCase() === "GET" ? undefined : JSON.stringify(body ?? {}),
    });

    const respHeaders = new Headers(CORS_HEADERS);
    upstream.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (!["content-encoding", "content-length", "transfer-encoding", "connection"].includes(lower)) {
        respHeaders.set(key, value);
      }
    });

    const bodyBuffer = await upstream.arrayBuffer();
    return new Response(bodyBuffer, { status: upstream.status, headers: respHeaders });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : String(err) }, 502);
  }
});
