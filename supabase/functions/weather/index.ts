const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WMO: Record<number, "Sunny" | "Cloudy" | "Raining" | "Snowing"> = {
  0: "Sunny", 1: "Sunny", 2: "Cloudy", 3: "Cloudy",
  45: "Cloudy", 48: "Cloudy",
  51: "Raining", 53: "Raining", 55: "Raining", 56: "Raining", 57: "Raining",
  61: "Raining", 63: "Raining", 65: "Raining", 66: "Raining", 67: "Raining",
  71: "Snowing", 73: "Snowing", 75: "Snowing", 77: "Snowing",
  80: "Raining", 81: "Raining", 82: "Raining",
  85: "Snowing", 86: "Snowing",
  95: "Raining", 96: "Raining", 99: "Raining",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const lat = parseFloat(url.searchParams.get("lat") ?? "");
    const lon = parseFloat(url.searchParams.get("lon") ?? "");
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return new Response(JSON.stringify({ error: "lat and lon required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`);
    const wData = await wRes.json();
    const tempC = Math.round(wData?.current?.temperature_2m ?? 0);
    const code = wData?.current?.weather_code ?? 0;
    const condition = WMO[code] ?? "Cloudy";

    let city = "Your location";
    try {
      const gRes = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=en`);
      const gData = await gRes.json();
      city = gData?.results?.[0]?.name ?? city;
    } catch (_) {}

    return new Response(JSON.stringify({ city, tempC, condition }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
