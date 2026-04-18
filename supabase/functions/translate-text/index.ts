// Edge function: translate-text
// Uses Lovable AI Gateway to translate arbitrary text to a target language.
// No JWT required (public translation utility).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LANG_NAMES: Record<string, string> = {
  en: "English",
  "en-US": "English (US)",
  es: "Spanish",
  fr: "French",
  de: "German",
  pt: "Portuguese",
  "pt-BR": "Brazilian Portuguese",
  it: "Italian",
  nl: "Dutch",
  pl: "Polish",
  ru: "Russian",
  uk: "Ukrainian",
  tr: "Turkish",
  ar: "Arabic",
  hi: "Hindi",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese (Simplified)",
  sv: "Swedish",
  no: "Norwegian",
  da: "Danish",
  fi: "Finnish",
  cs: "Czech",
  hu: "Hungarian",
  ro: "Romanian",
  el: "Greek",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, targetLang } = await req.json();

    if (!text || typeof text !== "string" || !targetLang) {
      return new Response(
        JSON.stringify({ error: "Missing 'text' or 'targetLang'." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Skip translation if target is English or text is too short
    if (targetLang.startsWith("en") || text.trim().length < 2) {
      return new Response(JSON.stringify({ translated: text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const langName = LANG_NAMES[targetLang] ?? targetLang;

    const aiRes = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            {
              role: "system",
              content:
                `You are a professional translator. Translate the user's text to ${langName}. ` +
                `Return ONLY the translated text — no explanations, no quotes, no labels. ` +
                `Preserve line breaks, numbers, proper nouns, tracking codes, and addresses.`,
            },
            { role: "user", content: text },
          ],
        }),
      },
    );

    if (aiRes.status === 429) {
      return new Response(
        JSON.stringify({ translated: text, error: "rate_limited" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    if (aiRes.status === 402) {
      return new Response(
        JSON.stringify({ translated: text, error: "payment_required" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    if (!aiRes.ok) {
      const err = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, err);
      return new Response(JSON.stringify({ translated: text }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const translated: string = data?.choices?.[0]?.message?.content?.trim() ?? text;

    return new Response(JSON.stringify({ translated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate-text error:", e);
    return new Response(
      JSON.stringify({ error: "Internal error", translated: null }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
