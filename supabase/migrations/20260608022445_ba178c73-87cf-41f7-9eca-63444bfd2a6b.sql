
CREATE TABLE public.user_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  occupation text NOT NULL,
  location text NOT NULL,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.user_reviews TO anon, authenticated;
GRANT ALL ON public.user_reviews TO service_role;

ALTER TABLE public.user_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews"
  ON public.user_reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can post a review"
  ON public.user_reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(display_name) BETWEEN 2 AND 40
    AND char_length(occupation) BETWEEN 2 AND 60
    AND char_length(location) BETWEEN 2 AND 80
    AND char_length(text) BETWEEN 10 AND 600
  );

CREATE POLICY "Admins can delete reviews"
  ON public.user_reviews FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE INDEX user_reviews_created_at_idx ON public.user_reviews (created_at DESC);
