# AURA — Adaptive Universal Banking & Proactive Fraud Shield
**Date:** 2026-09-03
**Repo:** `1rishLatte/AURA-Making-Digital-Banking-truly-accessible` (local `C:\Users\aadar\aura`)
**Region:** `ap-south-1` (Mumbai) · Locale `en-IN` · Currency `INR ₹` · Timezone `Asia/Kolkata`
**Tag:** `v1-demo` (judged artifact — DEMO_MODE=true, push-per-ticket)

---

## 1. Vision
Two linked problems:
1. **Accessible banking** that morphs UI for elderly + motor/visual/cognitive/dyslexia without reload.
2. **Fraud shield** that intercepts panic transfers, translates alerts to plain language + holds to confirm.

Winning strategy: **vault wow in 10s + 5 live journeys implying 30 conditions + never-fails offline demo**.

---

## 2. Design System — Eco “Vault at Dusk”
Near-monochrome ledger: `Bone #ffffff` / `Ash Mist #efefef` vs `Vault Ink #0f111a → Absolute #000`. One gradient `linear-gradient(90deg, #1c53bd, #53adfe)` at 8×8px marks only. No filled icons, no shadows (tonal elevation). Typography `Inter 400` (Interdisplay) + `Manrope 400` (Roobert) + `JetBrains Mono 400` + `Atkinson Hyperlegible` for dyslexia toggle. Radius `8px` (cards/inputs) / `128px` pills. Bands alternate light/dark full-bleed, 80–120px padding, 1280px inner.

Tokens via `@theme` OKLCH-mapped (hex in comments), semantic only in components. `color-scheme: light`, `theme-color #0f111a`, `min-h-[100dvh]`.

---

## 3. Architecture
```
aura/
├── app/layout.tsx (fonts display:swap, AdaptiveProvider, skip-link, theme-color)
├── app/page.tsx (vault hero + privacy band + dashboard + FraudShieldDemo + five vectors)
├── app/globals.css (@theme Eco OKLCH)
├── app/api/assistant/route.ts (Zod, intent-strip, generateObject + rule fallback, 10/min rate limit)
├── components/AdaptiveDashboard.tsx (layoutId 300/30 spring)
├── components/Header.tsx (profile toggle, Simple Mode pill, Atkinson pill)
├── components/BalanceCard.tsx, TransactionList.tsx, SimpleActionCard.tsx
├── components/SafetyConfirmCanvas.tsx (Canvas + GSAP 1.5s power2.out, Space hold, release-reset)
├── components/FraudIntercept.tsx (Safeguard vault band, 5s pause, hold + WebAuthn + trusted contact + tel handoff)
├── components/FraudShieldDemo.tsx (voice + form + API + intercept/allow)
├── components/VoiceInput.tsx (Web Speech en-IN, local only, interimResults, typed fallback)
├── components/HelpWidget.tsx (sticky bottom-right, 3.2.6)
├── lib/adaptive-context.tsx (profile + impairments vector, 44→68→72px, localStorage, CSS vars)
├── lib/config.ts (DEMO_MODE), lib/utils.ts (INR en-IN, cn), lib/mock-data.ts (20 txns, lakh)
├── lib/fraud-rules.ts (deterministic 0-100, flags, rule fallback)
├── lib/intent-strip.ts (client {action, amount, recipient_type} only)
├── lib/supabase/{client,server,middleware}.ts (gated)
├── supabase/migrations/20260903000001_aura_core.sql (RLS deny all + owner_id)
└── docs/superpowers/specs/2026-09-03-aura-design.md
```
Flag `NEXT_PUBLIC_DEMO_MODE=true` (default) — all Supabase code gated; offline demo never fails.

---

## 4. Accessibility — WCAG 2.2 AA (AAA touch)
- Generic: one `<h1>`, landmarks, skip-link, `aria-pressed`, `aria-live`, `focus-visible:ring 3:1`.
- **2.4.11 Focus Not Obscured AA:** sticky header 64px + `scroll-padding-top:80px` on all targets, modal trap returns to trigger.
- **2.5.7 Dragging AA:** no drag as primary — hold-not-drag + `Space/Enter` single-pointer alternative.
- **2.5.8 Target Size AA:** 24px floor, AURA ships 44 (standard) →68 (motor) →72 (vision) with `touch-action: manipulation`; spacing ≥24px where 24px unavoidable.
- **3.2.6 Consistent Help A:** `HelpWidget` fixed bottom-right, same DOM order `nav→main→help→footer` on every route/mode.
- Others: `prefers-reduced-motion` snap, `prefers-contrast: more`, `tabular-nums`, validation 61-rule checklist, `axe` + Lighthouse ≥95 on vision.

---

## 5. Key Components

### AdaptiveProvider
`profile: 'standard'|'motor'|'cognitive'|'vision'` + `simpleMode` (pill, maps to cognitive) + `dyslexiaMode` (Atkinson) + `Impac
airmentFlags {cognitive,motor,vision,hearing,dyslexia,anxiety}` vector. `deriveVars` 44/56/68/72px + scale. Writes `--aura-target`, `--aura-font-scale`, `data-dyslexia`.

### AdaptiveDashboard
`motion.div layout layoutId="dashboard-shell"` spring 300/30, `AnimatePresence popLayout`. `cognitive/simple` → `SimpleActionCard` (1/step, 40px, 65ch); `motor/vision` → expanded `TransactionList` with 68/72px rows.

### SafetyConfirmCanvas
200×200 DPR canvas, track + progress `arc(-90deg → -90+360*p)`, GSAP `to(v:1, duration:1.5, power2.out)` on `pointerdown`, `onConfirm` at 100%, `pointerup/leave/cancel` kill + 0.3s reset, keyboard `Space/Enter` hold, `aria-hidden` canvas + label `aria-live`.

### Fraud Intercept
`/api/assistant` returns `FraudResult {intent, riskScore 0-100, summary≤120, flags[4], action}`. `≥70 → intercept` → `FraudIntercept` replaces CTA with vault band: `SAFEGUARD • RISK 96/100 + flags`, `This is a new account... Take 5 seconds to review.` (no SMS 2FA), `SafetyConfirmCanvas` (800ms if WebAuthn passed), `Why flagged` list, `Try passive biometric`, `Cancel — I was tricked`, `Talk to human — priority queue` (tel:+91), `Notify Trusted Contact (1-tap)`.

### Voice + Intent Strip + AI
`VoiceInput` `SpeechRecognition` en-IN `continuous:false interim:true`, audio never `fetch`d. `stripToIntent(transcript)` → `{action:"TRANSFER", amount, recipient_type:"UNKNOWN_NEW_CONTACT"}` allowlist only. `POST /api/assistant` Zod validates server-side; if `OPENAI_API_KEY` set tries `generateObject(openai gpt-4o-mini, FraudResult)` else `scoreFraud` rule fallback (urgency + unknown + large + new_device). Offline always works.

### Supabase
Tables `profiles, accounts, transactions, fraud_events, biometric_sessions, trusted_contacts` all `ENABLE RLS` + `Deny All` → `CREATE POLICY "owner only" FOR ALL USING(auth.uid()=owner_id) WITH CHECK(auth.uid()=owner_id)`. `middleware` runs before handlers, 401/403, ownership verified separate from auth. `supabase/migrations` + `seed.sql` (20 INR lakh txns). `SUPABASE_SERVICE_ROLE_KEY` server-only, never `NEXT_PUBLIC_`.

---

## 6. Privacy (On-Device, Intent-Only, DPDP/AML)
- STT local (`SpeechRecognition` or `whisper.wasm`), tremor/layout calc in `AdaptiveContext` client, WebAuthn enclave only — no audio/tremor/template leaves device.
- Only stripped intent `{action, amount, recipient_type}` POSTs; raw transcript discarded. `fraud_events` stores stripped + risk only.
- AURA translates bank-mandated AML/KYC risk alerts into accessible UI — no new surveillance. DPDP Act 2023: purpose-limited, `owner_id` RLS, `ap-south-1`, erasure stub.

---

## 7. Emergency Edge Case (Delays, Never Denies)
Flag `new_device/unknown_payee/large≥25000` → **Intercept** → 5s plain-language pause (no OTP on broken phone) → **1.5s GSAP hold** (jitter <20px forgiven). Scam victim gets cognitive break → cancels; real emergency (knows why) holds → funds transfer immediately. Borrowed device → `Trusted Contact` 1-tap push OR `Talk to human — priority queue` tel with pre-filled ref.

---

## 8. Thirty → Five (Why Depth Wins)
Five `Imp
airmentFlags` compose to cover WHO/APA 30: `cognitive`→ASD/ADHD/Down/ID/Dyslexia/Aphasia/Dementia, `motor`→CP/MD/SCI/MS/ALS/Parkinson/RA, `vision/hearing`→Blind/Deaf/Deaf-Blind/SPD, `anxiety`→Depression/Bipolar/Schiz/GAD/PTSD/OCD, plus `dyslexia` Atkinson. Chronic (Epilepsy no strobe, ME/CFS no re-ask, diabetes neuropathy → motor+vision). Demo 5 journeys (10s each) same engine; appendix table maps 30→5. Add condition = set flags, not new UI.

---

## 9. Security (AGENTS.md)
- `.env*` in `.gitignore` pre-first-commit, `.env.example` placeholders only.
- Headers global in `next.config.ts`: CSP `default-src 'self'` + HSTS + `X-Frame DENY` + `nosniff` + `Referrer strict-origin-when-cross-origin` + `Permissions-Policy`.
- No `dangerouslySetInnerHTML` without DOMPurify, parametric queries only via Supabase client, magic-byte file validation if uploads, no `pickle`, bcrypt/Argon2 for passwords (if added), pinned exact deps, lockfile committed, no `NEXT_PUBLIC_` secrets, no wildcard CORS with credentials, rate limit 10/min.

---

## 10. Verification
`pnpm build && pnpm lint && tsc --noEmit`, `axe` + Lighthouse a11y≥95 on vision, `curl POST /api/assistant` (scam 98 intercept, benign 8 allow), `prefers-reduced-motion` snap, hold 1.5s confirm / 0.8s release reset / Space hold, DPR canvas sharp, 2.4.11 focus not obscured, Trusted Contact + tel flow.

---

## 11. Execution
Phase 0 scaffold → 1 Eco+Supabase → 2 Adaptive+Atkinson+WCAG → 3 Voice+intent+API → 4 Hold+WebAuthn → 5 Polish → `v1-demo` tag (this doc). Each commit `git push origin master` (push-per-ticket). Live `http://localhost:3000`, preview full-page screenshots `preview-*.png` (ignored).
