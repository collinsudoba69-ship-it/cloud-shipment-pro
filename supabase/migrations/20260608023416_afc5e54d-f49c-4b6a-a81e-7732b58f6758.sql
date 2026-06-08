CREATE POLICY "Public can delete reviews" ON public.user_reviews FOR DELETE USING (true);
GRANT DELETE ON public.user_reviews TO anon;