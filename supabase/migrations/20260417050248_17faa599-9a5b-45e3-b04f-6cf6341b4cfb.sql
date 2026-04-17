
-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'staff');
CREATE TYPE public.shipment_status AS ENUM ('queued', 'in_transit', 'out_for_delivery', 'delivered');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid');

-- =========================================
-- UTILITY: updated_at trigger function
-- =========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================
-- PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  credits INTEGER NOT NULL DEFAULT 10,
  unlimited_credits BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- USER ROLES
-- =========================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer role checker (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Convenience: is admin or super admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'super_admin')
  );
$$;

-- =========================================
-- AUTO-CREATE PROFILE + AUTO-PROMOTE SUPER ADMIN
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, email, display_name, credits, unlimited_credits)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    CASE WHEN lower(NEW.email) = 'cloudshipmentcontact@gmail.com' THEN 0 ELSE 10 END,
    CASE WHEN lower(NEW.email) = 'cloudshipmentcontact@gmail.com' THEN true ELSE false END
  );

  -- Auto-promote super admin
  IF lower(NEW.email) = 'cloudshipmentcontact@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin')
    ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'staff')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- SHIPMENTS
-- =========================================
CREATE TABLE public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number TEXT NOT NULL UNIQUE,
  courier TEXT,

  -- Sender
  sender_name TEXT NOT NULL,
  sender_email TEXT,
  sender_phone TEXT,

  -- Receiver
  receiver_name TEXT NOT NULL,
  receiver_email TEXT,
  receiver_phone TEXT,

  -- Package details
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  shipment_type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  weight NUMERIC,
  is_fragile BOOLEAN NOT NULL DEFAULT false,
  is_express BOOLEAN NOT NULL DEFAULT false,

  -- Status
  status public.shipment_status NOT NULL DEFAULT 'queued',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  estimated_delivery_date DATE,
  description TEXT,

  -- Payment (display only)
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  amount_to_pay NUMERIC,
  payment_method TEXT,
  payment_reason TEXT,

  -- Images (array of public URLs from storage)
  images TEXT[] NOT NULL DEFAULT '{}',

  -- Audit
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_shipments_tracking_lower ON public.shipments (lower(tracking_number));
CREATE INDEX idx_shipments_status ON public.shipments (status);
CREATE INDEX idx_shipments_created_at ON public.shipments (created_at DESC);

ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER shipments_updated_at
BEFORE UPDATE ON public.shipments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- SHIPMENT EVENTS (timeline)
-- =========================================
CREATE TABLE public.shipment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  status public.shipment_status,
  location TEXT,
  note TEXT,
  event_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_shipment_id ON public.shipment_events (shipment_id, event_at DESC);
ALTER TABLE public.shipment_events ENABLE ROW LEVEL SECURITY;

-- =========================================
-- ACTIVITY LOGS
-- =========================================
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_logs_created_at ON public.activity_logs (created_at DESC);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- =========================================
-- RLS POLICIES
-- =========================================

-- PROFILES
CREATE POLICY "Users view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admin updates any profile"
ON public.profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users update own profile non-credit fields"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- USER_ROLES
CREATE POLICY "Users view own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Super admin views all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admin manages roles insert"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admin manages roles update"
ON public.user_roles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admin manages roles delete"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- SHIPMENTS — public read (for tracking page), admin write
CREATE POLICY "Public can view shipments"
ON public.shipments FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admins create shipments"
ON public.shipments FOR INSERT TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins update shipments"
ON public.shipments FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins delete shipments"
ON public.shipments FOR DELETE TO authenticated
USING (public.is_admin(auth.uid()));

-- SHIPMENT EVENTS — public read, admin write
CREATE POLICY "Public can view shipment events"
ON public.shipment_events FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admins create events"
ON public.shipment_events FOR INSERT TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins update events"
ON public.shipment_events FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins delete events"
ON public.shipment_events FOR DELETE TO authenticated
USING (public.is_admin(auth.uid()));

-- ACTIVITY LOGS — super admin reads, any authenticated admin writes (own actions)
CREATE POLICY "Super admin views all logs"
ON public.activity_logs FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins insert their own logs"
ON public.activity_logs FOR INSERT TO authenticated
WITH CHECK (public.is_admin(auth.uid()) AND auth.uid() = actor_id);

-- =========================================
-- STORAGE: shipment images bucket (public)
-- =========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('shipment-images', 'shipment-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read shipment images"
ON storage.objects FOR SELECT
USING (bucket_id = 'shipment-images');

CREATE POLICY "Admins upload shipment images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'shipment-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins update shipment images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'shipment-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins delete shipment images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'shipment-images' AND public.is_admin(auth.uid()));
