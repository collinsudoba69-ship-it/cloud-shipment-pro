// Public customer statement - returns customer + payments for a single slug.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { slug } = await req.json();
    const s = (slug ?? "").toString().trim();
    if (!s || s.length > 128) {
      return new Response(JSON.stringify({ error: "Invalid slug" }), {
        status: 400, headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: customer, error: cErr } = await supabase
      .from("customers")
      .select("id, name, slug, goal_amount, tracking_number")
      .eq("slug", s)
      .maybeSingle();
    if (cErr) throw cErr;
    if (!customer) {
      return new Response(JSON.stringify({ customer: null, payments: [] }), {
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const { data: payments, error: pErr } = await supabase
      .from("payments")
      .select("id, amount, reason, paid_at")
      .eq("customer_id", customer.id)
      .order("paid_at", { ascending: true });
    if (pErr) throw pErr;

    return new Response(JSON.stringify({ customer, payments: payments ?? [] }), {
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (err) {
    console.error("public-statement error", err);
    return new Response(JSON.stringify({ error: "Unable to fetch statement" }), {
      status: 500, headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }
});
