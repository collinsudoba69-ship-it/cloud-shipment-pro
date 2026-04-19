CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view app settings"
ON public.app_settings FOR SELECT
USING (true);

CREATE POLICY "Admins insert app settings"
ON public.app_settings FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins update app settings"
ON public.app_settings FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.app_settings (key, value)
VALUES ('whatsapp_support_number', '+16833182000')
ON CONFLICT (key) DO NOTHING;