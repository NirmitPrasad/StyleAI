import { supabase } from "@/integrations/supabase/client";

// Centralized API client. Uses Lovable Cloud edge functions by default.
// To swap to your FastAPI backend, set VITE_API_BASE_URL and the calls
// below will hit `${VITE_API_BASE_URL}/<path>` instead.
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "");

async function callExternal<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
  return res.json();
}

export type Weather = {
  city: string;
  region?: string;
  country?: string;
  lat?: number;
  lon?: number;
  tempC: number;
  condition: "Sunny" | "Cloudy" | "Raining" | "Snowing";
};

export async function fetchWeather(lat: number, lon: number): Promise<Weather> {
  if (API_BASE) return callExternal(`/api/weather?lat=${lat}&lon=${lon}`, { method: "GET" });
  const { data, error } = await supabase.functions.invoke("weather", {
    method: "GET" as any,
    // pass via query string by appending — invoke doesn't support GET params, so use POST fallback
  });
  if (error) {
    // fallback: call function URL directly with query string
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/weather?lat=${lat}&lon=${lon}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
    });
    if (!res.ok) throw new Error(`Weather failed: ${res.status}`);
    return res.json();
  }
  return data as Weather;
}

// Direct GET (preferred path)
export async function getWeather(lat: number, lon: number): Promise<Weather> {
  if (API_BASE) return callExternal(`/api/weather?lat=${lat}&lon=${lon}`, { method: "GET" });
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/weather?lat=${lat}&lon=${lon}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });
  if (!res.ok) throw new Error(`Weather failed: ${res.status}`);
  return res.json();
}

export type Recommendation = { title: string; pieces: string[]; rationale: string };
export type ClosetItem = { name: string; category: string; tags: string[] };

export async function recommendOutfit(payload: {
  circumstances: string[];
  factorWeather: boolean;
  weather: Weather | null;
  items: ClosetItem[];
}): Promise<Recommendation> {
  if (API_BASE)
    return callExternal(`/api/closet/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  const { data, error } = await supabase.functions.invoke("closet-recommend", { body: payload });
  if (error) throw error;
  return data as Recommendation;
}

export type SimilarItem = { id: string; title: string; price: string; thumb: string; url: string; retailer?: string };
export type VisualSearchResponse = { description: string; items: SimilarItem[] };

export type ChatMsg = {
  role: "user" | "assistant";
  content:
    | string
    | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }>;
};
export async function styleChat(payload: {
  messages: ChatMsg[];
  weather: Weather | null;
  closet: ClosetItem[];
  location: { city?: string; region?: string; country?: string } | null;
}): Promise<{ reply: string }> {
  if (API_BASE)
    return callExternal(`/api/style-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  const { data, error } = await supabase.functions.invoke("style-chat", { body: payload });
  if (error) throw error;
  return data as { reply: string };
}

export async function styleChatStream(
  payload: {
    messages: ChatMsg[];
    weather: Weather | null;
    closet: ClosetItem[];
    location: { city?: string; region?: string; country?: string } | null;
  },
  onChunk: (chunk: string) => void,
): Promise<void> {
  if (API_BASE) {
    const { reply } = await styleChat(payload);
    onChunk(reply);
    return;
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase function URL or publishable key is not configured");
  }

  const url = `${supabaseUrl}/functions/v1/style-chat`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
  };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ ...payload, stream: true }),
  });

  if (!res.ok) {
    throw new Error((await res.text()) || `HTTP ${res.status}`);
  }

  if (!res.body) {
    throw new Error("No stream available");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line === "[DONE]") continue;
      const payloadLine = line.startsWith("data:") ? line.slice(5).trim() : line;
      if (!payloadLine) continue;

      let chunk = payloadLine;
      try {
        const json = JSON.parse(payloadLine);
        chunk = json?.choices?.[0]?.delta?.content ?? json?.choices?.[0]?.message?.content ?? json?.text ?? payloadLine;
      } catch {
        // keep raw text if it is not JSON
      }

      if (chunk) {
        onChunk(chunk);
      }
    }
  }
}

export async function visualSearch(image: string): Promise<VisualSearchResponse> {
  if (API_BASE) {
    return callExternal(`/api/visual-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });
  }
  const { data, error } = await supabase.functions.invoke("visual-search", { body: { image } });
  if (error) throw error;
  return data as VisualSearchResponse;
}

export type StyleAnalysis = { score: number; aesthetic: string[]; advice: string[] };

export async function rateStyle(payload: { facePhoto: string | null; closet: ClosetItem[] }): Promise<StyleAnalysis> {
  if (API_BASE)
    return callExternal(`/api/style-rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  const { data, error } = await supabase.functions.invoke("style-rating", { body: payload });
  if (error) throw error;
  return data as StyleAnalysis;
}
