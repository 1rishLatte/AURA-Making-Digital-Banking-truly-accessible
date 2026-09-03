export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const HAS_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !DEMO_MODE);
