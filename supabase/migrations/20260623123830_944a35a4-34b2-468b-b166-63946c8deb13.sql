
-- Unschedule cron job (if exists)
DO $$
DECLARE jid bigint;
BEGIN
  SELECT jobid INTO jid FROM cron.job WHERE jobname = 'auto-hold-overdue-shipments';
  IF jid IS NOT NULL THEN
    PERFORM cron.unschedule(jid);
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Drop the auto-hold function
DROP FUNCTION IF EXISTS public.auto_hold_overdue_shipments();

-- Restore each on_hold shipment to its previous status (from latest non-on_hold event)
UPDATE public.shipments s
SET status = COALESCE((
  SELECT e.status
  FROM public.shipment_events e
  WHERE e.shipment_id = s.id
    AND e.status <> 'on_hold'
  ORDER BY e.event_at DESC
  LIMIT 1
), 'in_transit'),
updated_at = now()
WHERE s.status = 'on_hold';

-- Remove the auto-generated on_hold log entries
DELETE FROM public.shipment_events
WHERE status = 'on_hold'
  AND note = 'Automatically placed on hold — estimated delivery date passed without further updates.';
