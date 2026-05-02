import { useEffect, useState } from "react";
import { Cloud, CloudRain, Loader2, MapPin, Sun } from "lucide-react";

export type Weather = {
  city: string;
  tempC: number;
  condition: "Sunny" | "Cloudy" | "Raining";
};

// Skeleton for backend wiring later
export async function fetchWeather(lat: number, lon: number): Promise<Weather> {
  // TODO: wire up to FastAPI backend
  // const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
  // if (!res.ok) throw new Error("Weather fetch failed");
  // return res.json();
  await new Promise((r) => setTimeout(r, 600));
  const conditions: Weather["condition"][] = ["Sunny", "Cloudy", "Raining"];
  return {
    city: "Paris",
    tempC: 18 + Math.round(Math.random() * 6),
    condition: conditions[Math.floor(Math.random() * 3)],
  };
}

const ConditionIcon = ({ c }: { c: Weather["condition"] }) => {
  if (c === "Sunny") return <Sun className="h-5 w-5" />;
  if (c === "Raining") return <CloudRain className="h-5 w-5" />;
  return <Cloud className="h-5 w-5" />;
};

export const useWeather = () => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      fetchWeather(0, 0).then(setWeather).finally(() => setLoading(false));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather(pos.coords.latitude, pos.coords.longitude)
          .then(setWeather)
          .finally(() => setLoading(false));
      },
      () => {
        setDenied(true);
        fetchWeather(0, 0).then(setWeather).finally(() => setLoading(false));
      },
      { timeout: 5000 }
    );
  }, []);

  return { weather, loading, denied };
};

export const WeatherWidget = () => {
  const { weather, loading, denied } = useWeather();

  return (
    <div className="flex items-center justify-between border border-border bg-card px-5 py-4">
      <div className="flex items-center gap-3">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-[10px] uppercase tracking-editorial text-muted-foreground">
            {denied ? "Default location" : "Your location"}
          </p>
          <p className="font-serif text-lg leading-tight">{loading ? "—" : weather?.city}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <>
            <ConditionIcon c={weather!.condition} />
            <div className="text-right">
              <p className="font-serif text-2xl leading-none">{weather!.tempC}°</p>
              <p className="text-[10px] uppercase tracking-editorial text-muted-foreground mt-1">
                {weather!.condition}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
