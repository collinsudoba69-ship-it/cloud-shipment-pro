
GRANT SELECT ON public.shipments, public.shipment_events, public.customers, public.payments TO authenticated;

CREATE POLICY "Admins read shipments" ON public.shipments FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins read shipment_events" ON public.shipment_events FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins read customers" ON public.customers FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins read payments" ON public.payments FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
