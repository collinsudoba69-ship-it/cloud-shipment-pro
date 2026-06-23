
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Function: flip overdue shipments to on_hold
CREATE OR REPLACE FUNCTION public.auto_hold_overdue_shipments()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected integer := 0;
  r record;
BEGIN
  FOR r IN
    SELECT id, origin
    FROM public.shipments
    WHERE status NOT IN ('delivered', 'on_hold')
      AND estimated_delivery_date IS NOT NULL
      AND estimated_delivery_date < (now() AT TIME ZONE 'UTC')::date
  LOOP
    UPDATE public.shipments
       SET status = 'on_hold', updated_at = now()
     WHERE id = r.id;

    INSERT INTO public.shipment_events (shipment_id, status, location, note, event_at, created_by)
    VALUES (r.id, 'on_hold', r.origin, 'Automatically placed on hold — estimated delivery date passed without further updates.', now(), NULL);

    affected := affected + 1;
  END LOOP;

  RETURN affected;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.auto_hold_overdue_shipments() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.auto_hold_overdue_shipments() TO service_role;

-- Remove any previous schedule with the same name, then re-create
DO $$
BEGIN
  PERFORM cron.unschedule('auto-hold-overdue-shipments');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

SELECT cron.schedule(
  'auto-hold-overdue-shipments',
  '*/30 * * * *',
  $$ SELECT public.auto_hold_overdue_shipments(); $$
);
