import { corsHeaders } from "@supabase/supabase-js/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { facePhoto = null, closet = [] } = await req.json();
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not set");

    const sys = `You are an elite fashion critic. Return strict JSON: {"score":number (0-10, one decimal),"aesthetic":string[] (2-3 styles),"advice":string[] (3 specific tips)}.`;
    const userText = `Closet items: ${JSON.stringify(closet)}. Rate the user's potential style and aesthetic based on closet${facePhoto ? " and face photo" : ""}.`;
    const userContent: any = facePhoto
      ? [{ type: "text", text: userText }, { type: "image_url", image_url: { url: facePhoto } }]
      : userText;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: sys }, { role: "user", content: userContent }],
        response_format: { type: "json_object" },
      }),
    });
    if (aiRes.status === 429) return new Response(JSON.stringify({ error: "Rate limit" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (aiRes.status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const data = await aiRes.json();
    const content = data?.choices?.[0]?.message?.content ?? "{}";
    return new Response(content, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
