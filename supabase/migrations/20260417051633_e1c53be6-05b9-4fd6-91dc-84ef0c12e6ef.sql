-- Add a "shipped_at" registration date to shipments (when it entered the facility)
ALTER TABLE public.shipments
  ADD COLUMN IF NOT EXISTS shipped_at timestamptz NOT NULL DEFAULT now();

-- Backfill existing rows from created_at
UPDATE public.shipments SET shipped_at = created_at WHERE shipped_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_shipments_shipped_at ON public.shipments(shipped_at DESC);