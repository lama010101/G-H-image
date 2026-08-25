/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_REVE_ENDPOINT_PATH?: string;
  readonly VITE_REVE_ACCEPT?: string;
  readonly VITE_GEN_CONCURRENCY?: string;
  // add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
