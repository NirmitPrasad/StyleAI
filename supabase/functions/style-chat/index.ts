const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { messages = [], weather = null, closet = [], location = null } = await req.json();
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not set");

    const sys = `You are a friendly, expert AI fashion stylist for the Indian market. You speak in a warm, concise, magazine-editor tone.

Context:
- User location: ${location ? `${location.city}${location.region ? ", " + location.region : ""}${location.country ? ", " + location.country : ""}` : "unknown"}
- Current weather: ${weather ? `${weather.tempC}°C ${weather.condition}` : "unknown"}
- User's wardrobe: ${JSON.stringify(closet)}

Guidelines:
- Recommend looks suitable for India (weather, occasion, culture).
- When suggesting where to shop, recommend Myntra, Amazon.in, Shein, or Ajio with prices in ₹ (INR).
- When the user describes an occasion (casual, party, college, office, date, wedding, festival, gym, brunch), pick pieces from their wardrobe and suggest 1–2 add-ons from the Indian retailers above.
- Keep replies under ~120 words. Use short paragraphs and bullet points where helpful.
- Never invent items in the user's wardrobe — only use what's listed.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: sys }, ...messages],
      }),
    });
    if (aiRes.status === 429) return new Response(JSON.stringify({ error: "Rate limit" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (aiRes.status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const data = await aiRes.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
