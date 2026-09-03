-- Seed for demo user — run as service_role after auth.users insert
-- Reuse mock INR amounts, lakh-friendly
-- Insert demo account + 20 transactions owned by first user for local DEMO_MODE preview
insert into public.accounts (id, owner_id, balance, currency)
select '11111111-1111-1111-1111-111111111111'::uuid, id, 485720.50, 'INR' from auth.users limit 1
on conflict (id) do nothing;
