
CREATE OR REPLACE FUNCTION public.gen_tracking_number()
RETURNS text
LANGUAGE sql
VOLATILE
SET search_path = public
AS $$
  SELECT 'CS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
$$;

CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  goal_amount NUMERIC(10,2) NOT NULL DEFAULT 100.00,
  tracking_number TEXT NOT NULL DEFAULT public.gen_tracking_number() UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  reason TEXT NOT NULL,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX payments_customer_id_idx ON public.payments(customer_id);
CREATE INDEX payments_paid_at_idx ON public.payments(paid_at DESC);

GRANT SELECT ON public.customers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;

GRANT SELECT ON public.payments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Admins insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins update customers" ON public.customers FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins delete customers" ON public.customers FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Public can read payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Admins insert payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins update payments" ON public.payments FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins delete payments" ON public.payments FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
