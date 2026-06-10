
-- Add dedupe columns
ALTER TABLE public.user_reviews
  ADD COLUMN IF NOT EXISTS device_id text,
  ADD COLUMN IF NOT EXISTS review_day date,
  ADD COLUMN IF NOT EXISTS name_key text,
  ADD COLUMN IF NOT EXISTS text_key text;

-- Trigger to populate normalized keys + UTC day
CREATE OR REPLACE FUNCTION public.user_reviews_set_keys()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.review_day := (COALESCE(NEW.created_at, now()) AT TIME ZONE 'UTC')::date;
  NEW.name_key := lower(btrim(NEW.display_name));
  NEW.text_key := lower(regexp_replace(btrim(NEW.text), '\s+', ' ', 'g'));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_reviews_set_keys_trg ON public.user_reviews;
CREATE TRIGGER user_reviews_set_keys_trg
  BEFORE INSERT OR UPDATE ON public.user_reviews
  FOR EACH ROW EXECUTE FUNCTION public.user_reviews_set_keys();

-- Backfill existing rows so unique indexes can be built
UPDATE public.user_reviews
SET review_day = (created_at AT TIME ZONE 'UTC')::date,
    name_key = lower(btrim(display_name)),
    text_key = lower(regexp_replace(btrim(text), '\s+', ' ', 'g'))
WHERE review_day IS NULL OR name_key IS NULL OR text_key IS NULL;

-- One review per device per UTC day
CREATE UNIQUE INDEX IF NOT EXISTS user_reviews_unique_device_per_day
  ON public.user_reviews (device_id, review_day)
  WHERE device_id IS NOT NULL;

-- No two reviews with the same display name on the same day
CREATE UNIQUE INDEX IF NOT EXISTS user_reviews_unique_name_per_day
  ON public.user_reviews (name_key, review_day);

-- No two reviews with the same text on the same day
CREATE UNIQUE INDEX IF NOT EXISTS user_reviews_unique_text_per_day
  ON public.user_reviews (text_key, review_day);
