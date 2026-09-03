# AURA — Making Digital Banking truly accessible.

**Adaptive Universal Banking & Proactive Fraud Shield** — vault at dusk, WCAG 2.2 AA, INR `en-IN`, voice-first, 72px targets, and a fraud shield that delays, never denies.

**Live (dev):** `http://localhost:3000` — push-per-ticket to **GitHub:** https://github.com/1rishLatte/AURA-Making-Digital-Banking-truly-accessible

## Why this wins (90s story)
1. **Vault wow (10s):** Eco near-monochrome (`#0f111a` vs `#ffffff`), 96px Manrope, single blue 8×8 mark — a bank lobby, not a template.
2. **Morph (30s):** Same `layoutId` cards spring `300/30` — `standard→cognitive→motor→vision` + **Simple Mode** pill + **Atkinson Hyperlegible** dyslexia toggle (body 1.6/0.02em/65ch) without reload.
3. **Scam vs real emergency (40s):** Voice *“Transfer ₹50,000 to unknown account for emergency bail”* → **Risk 98/100** → **Safeguard vault band** *“Take 5 seconds to review.”* → **GSAP 1.5s hold** (jitter-forgiving, Space hold, release-reset). Panic tap blocked; real emergency holds → funds move. Borrowed phone? **Trusted Contact 1-tap** or **Talk to human — priority queue**.

## Five vectors cover thirty (WHO/APA)
`cognitive|motor|vision|hearing|anxiety` + dyslexia compose: Neuro (ASD/ADHD/Dyslexia…)→Simple+Atkinson, Physical (CP/ALS/Parkinson…)→68-72px hold-not-drag, Sensory (Blind/Deaf/SPD)→SR landmarks+typed fallback+reduced-motion, Chronic (Epilepsy no strobe, ME/CFS no re-ask), Mental Health → calm copy, no pressure animation. **Demo 5 journeys implying 30** — full table in `docs/superpowers/specs/2026-09-03-aura-design.md`.

## Privacy — on-device, intent-only, DPDP/AML
- **On-device:** SpeechRecognition/WebAssembly STT, layout calc in `AdaptiveContext` — no audio/tremor leaves the device.
- **Intent-only:** Only `{action:"TRANSFER", amount:50000, recipient_type:"UNKNOWN_NEW_CONTACT"}` POSTs to `/api/assistant`; raw audio discarded instantly.
- **We translate, not surveil:** Banks already AML/KYC-flag unusual transfers — AURA just makes the flag readable. `owner_id` RLS `Deny All`, `ap-south-1`, server-only `SERVICE_ROLE_KEY`.

## Quick start
```bash
git clone https://github.com/1rishLatte/AURA-Making-Digital-Banking-truly-accessible.git
cd AURA-Making-Digital-Banking-truly-accessible # local aura
npm install
cp .env.example .env.local # add OPENAI_API_KEY / Supabase if you have them — demo works without
npm run dev   # http://localhost:3000
npm run build # must pass before push
```

## Demo script (copy-paste)
- **Scam:** `Transfer ₹50,000 to unknown account for emergency bail` → **Intercept** 96/100, hold to see `Take 5 seconds`, release early → resets.
- **Scam:** `Buy ₹25,000 gift card urgently for stranger` → intercept.
- **Benign:** `Transfer ₹5,000 to Sunita Devi` → **Allow** 8/100, `Send now`.

## Tech
Next.js 16.3.4 (App Router, Turbopack) • React 19 • Tailwind v4 `@theme` Eco OKLCH • Framer Motion 11.18.2 `layoutId` • GSAP 3.13.0 Canvas • Vercel AI SDK 5 `generateObject` + `@ai-sdk/openai` • Zod • Supabase (`utils` RLS) • `ap-south-1` • `en-IN` • `INR ₹` lakh • Atkinson Hyperlegible.

## Security
Global headers in `next.config.ts` (CSP/HSTS/X-Frame/nosniff/Referrer), `.env*` in `.gitignore` pre-first-commit, rate limit 10/min (respecting `X-Forwarded-For` only behind trusted proxy), no `dangerouslySetInnerHTML` without DOMPurify, parametric Supabase queries.

## WCAG 2.2 AA
2.4.11 Focus Not Obscured (sticky header + `scroll-padding-top:80px`), 2.5.7 Drag alternative (hold-not-drag + Space), 2.5.8 Target 24px (ships 44-72), 3.2.6 Consistent Help (sticky bottom-right).

## Supabase
```sql
supabase/migrations/20260903000001_aura_core.sql # ap-south-1, RLS deny all
supabase/seed.sql # 20 INR txns
```
Apply: `npx supabase db push --linked` (requires `NEXT_PUBLIC_SUPABASE_URL`).

---
© 2026 AURA • Crafted for India • Tag `v1-demo` is the judged artifact.

<!-- auto-deploy test 2026-09-03T16:52:22.6697064+05:30 -->
