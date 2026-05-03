import { useEffect, useState } from "react";
import { Cloud, CloudRain, Loader2, MapPin, Snowflake, Sun } from "lucide-react";
import { getWeather, type Weather } from "@/lib/api";

export type { Weather };

const ConditionIcon = ({ c }: { c: Weather["condition"] }) => {
  if (c === "Sunny") return <Sun className="h-5 w-5 text-amber-300" />;
  if (c === "Raining") return <CloudRain className="h-5 w-5 text-sky-300" />;
  if (c === "Snowing") return <Snowflake className="h-5 w-5 text-sky-200" />;
  return <Cloud className="h-5 w-5 text-muted-foreground" />;
};

export const useWeather = () => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const fallback = () => {
      // Paris fallback coords
      getWeather(48.8566, 2.3522).then(setWeather).catch(() => {}).finally(() => setLoading(false));
    };
    if (!("geolocation" in navigator)) return fallback();
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        getWeather(pos.coords.latitude, pos.coords.longitude)
          .then(setWeather)
          .catch(() => {})
          .finally(() => setLoading(false));
      },
      () => {
        setDenied(true);
        fallback();
      },
      { timeout: 6000 }
    );
  }, []);

  return { weather, loading, denied };
};

export const WeatherWidget = () => {
  const { weather, loading, denied } = useWeather();

  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card/60 backdrop-blur px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary">
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {denied ? "Default location" : "Location"}
          </p>
          <p className="font-semibold text-base leading-tight">
            {loading ? "—" : [weather?.city, weather?.region, weather?.country].filter(Boolean).join(", ") || "Unknown"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : weather ? (
          <>
            <ConditionIcon c={weather.condition} />
            <div className="text-right">
              <p className="font-bold text-2xl leading-none">{weather.tempC}°</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                {weather.condition}
              </p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
