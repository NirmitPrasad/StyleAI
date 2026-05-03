const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { image } = await req.json();
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not set");
    if (!image) throw new Error("image required");

    const sys = `You are an Indian fashion vision assistant. Identify the garment (color, fabric, cut, style, occasion). Return STRICT JSON:
{"description": string, "items": [{"id": string, "title": string, "price": string, "thumb": string, "url": string, "retailer": "Myntra"|"Amazon"|"Shein"|"Ajio"}]}

Generate 8 plausible Indian shoppable items — exactly 2 from each retailer (Myntra, Amazon, Shein, Ajio). Prices in Indian Rupees with ₹ symbol (e.g. "₹1,499"). Use realistic Indian price ranges (₹399 – ₹4,999 typical).

For thumb, use real Unsplash photos that match the garment style: https://images.unsplash.com/photo-XXXX?w=400&q=80 (use plausible photo IDs of fashion / clothing).

For url, use these search URL patterns with the garment keywords URL-encoded:
- Myntra: https://www.myntra.com/<keywords-with-hyphens>
- Amazon: https://www.amazon.in/s?k=<encoded keywords>
- Shein: https://in.shein.com/pdsearch/<encoded keywords>
- Ajio: https://www.ajio.com/search/?text=<encoded keywords>

Titles should sound like real Indian listings (e.g. "Women Floral Print Anarkali Kurta", "Men Slim Fit Cotton Casual Shirt").`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: [
            { type: "text", text: "Find similar items to this garment available in India." },
            { type: "image_url", image_url: { url: image } },
          ]},
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (aiRes.status === 429) return new Response(JSON.stringify({ error: "Rate limit" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (aiRes.status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const data = await aiRes.json();
    const content = data?.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
