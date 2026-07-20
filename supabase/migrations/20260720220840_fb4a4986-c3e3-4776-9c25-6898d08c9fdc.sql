
-- Lock down publicly-readable tables (customers, payments, shipments, shipment_events).
-- Public tracking + statement flows now go through edge functions with service-role access.
DROP POLICY IF EXISTS "Public can view shipments" ON public.shipments;
DROP POLICY IF EXISTS "Public can view shipment events" ON public.shipment_events;
DROP POLICY IF EXISTS "Public can read customers" ON public.customers;
DROP POLICY IF EXISTS "Public can read payments" ON public.payments;

REVOKE SELECT ON public.shipments FROM anon;
REVOKE SELECT ON public.shipment_events FROM anon;
REVOKE SELECT ON public.customers FROM anon;
REVOKE SELECT ON public.payments FROM anon;

-- Prevent regular users from escalating their own credits via the profiles UPDATE policy.
DROP POLICY IF EXISTS "Users update own profile non-credit fields" ON public.profiles;
CREATE POLICY "Users update own profile non-credit fields"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND credits = (SELECT p.credits FROM public.profiles p WHERE p.user_id = auth.uid())
  AND unlimited_credits = (SELECT p.unlimited_credits FROM public.profiles p WHERE p.user_id = auth.uid())
);
