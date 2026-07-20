// Public shipment tracking - returns only the specific shipment for a tracking number.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { tracking_number } = await req.json();
    const tn = (tracking_number ?? "").toString().trim().replace(/\s+/g, "");
    if (!tn || tn.length > 64) {
      return new Response(JSON.stringify({ error: "Invalid tracking number" }), {
        status: 400, headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: shipment, error: sErr } = await supabase
      .from("shipments")
      .select("*")
      .ilike("tracking_number", tn)
      .maybeSingle();

    if (sErr) throw sErr;
    if (!shipment) {
      return new Response(JSON.stringify({ shipment: null, events: [] }), {
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const { data: events, error: eErr } = await supabase
      .from("shipment_events")
      .select("id, status, note, location, event_at")
      .eq("shipment_id", shipment.id)
      .order("event_at", { ascending: true });
    if (eErr) throw eErr;

    return new Response(JSON.stringify({ shipment, events: events ?? [] }), {
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (err) {
    console.error("public-track error", err);
    return new Response(JSON.stringify({ error: "Unable to fetch shipment" }), {
      status: 500, headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }
});
