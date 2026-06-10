
-- 1) Remove dangerous public delete policy on user_reviews
DROP POLICY IF EXISTS "Public can delete reviews" ON public.user_reviews;

-- 2) Lock down profile credit columns at the privilege layer
-- Revoke broad UPDATE, re-grant only on safe columns
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (display_name, email) ON public.profiles TO authenticated;
-- service_role and super admins (via separate policy) retain full UPDATE
GRANT ALL ON public.profiles TO service_role;
