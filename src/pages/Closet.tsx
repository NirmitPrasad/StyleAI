import { TopNav } from "@/components/TopNav";
import { WeatherWidget, useWeather } from "@/components/WeatherWidget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const CIRCUMSTANCES = ["Casual", "Party", "Formal", "Workout", "Summer", "Winter"] as const;
type Circumstance = (typeof CIRCUMSTANCES)[number];

const items = [
  { name: "Silk Slip Dress", category: "Dresses", tags: ["Party", "Summer"] },
  { name: "Wool Trench", category: "Outerwear", tags: ["Formal", "Winter"] },
  { name: "Cashmere Knit", category: "Knitwear", tags: ["Casual", "Winter"] },
  { name: "Tailored Trouser", category: "Bottoms", tags: ["Formal"] },
  { name: "Leather Loafer", category: "Footwear", tags: ["Casual", "Formal"] },
  { name: "Linen Shirt", category: "Tops", tags: ["Casual", "Summer"] },
  { name: "Performance Tee", category: "Tops", tags: ["Workout", "Summer"] },
  { name: "Quilted Coat", category: "Outerwear", tags: ["Winter"] },
];

type Recommendation = { title: string; pieces: string[]; rationale: string };

async function postRecommendation(payload: {
  circumstances: Circumstance[];
  factorWeather: boolean;
  weather: unknown;
}): Promise<Recommendation> {
  // TODO: wire up to FastAPI: POST /api/closet/recommend
  // const res = await fetch("/api/closet/recommend", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // return res.json();
  await new Promise((r) => setTimeout(r, 1400));
  return {
    title: "Effortless Evening",
    pieces: ["Silk Slip Dress", "Wool Trench", "Leather Loafer"],
    rationale: `A composed silhouette tuned for ${payload.circumstances.join(", ") || "any moment"}${
      payload.factorWeather ? " — layered for current conditions." : "."
    }`,
  };
}

const Closet = () => {
  const [filter, setFilter] = useState<Set<Circumstance>>(new Set());
  const [recCircs, setRecCircs] = useState<Set<Circumstance>>(new Set());
  const [factorWeather, setFactorWeather] = useState(true);
  const [loadingRec, setLoadingRec] = useState(false);
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [open, setOpen] = useState(false);
  const { weather } = useWeather();

  useEffect(() => {
    document.title = "My Closet — Maison";
  }, []);

  const toggle = (set: Set<Circumstance>, c: Circumstance, setter: (s: Set<Circumstance>) => void) => {
    const next = new Set(set);
    next.has(c) ? next.delete(c) : next.add(c);
    setter(next);
  };

  const filtered = filter.size === 0 ? items : items.filter((i) => i.tags.some((t) => filter.has(t as Circumstance)));

  const getRecommendation = async () => {
    setOpen(true);
    setLoadingRec(true);
    setRec(null);
    const r = await postRecommendation({
      circumstances: Array.from(recCircs),
      factorWeather,
      weather,
    });
    setRec(r);
    setLoadingRec(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-10 sm:py-16">
        <WeatherWidget />

        {/* What should I wear */}
        <section className="mt-10 border border-border bg-card p-6 sm:p-10">
          <p className="text-xs uppercase tracking-editorial text-muted-foreground">Style Concierge</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-5xl">What should I wear?</h2>

          <div className="mt-8">
            <Label className="text-[10px] uppercase tracking-editorial text-muted-foreground">
              Circumstance
            </Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {CIRCUMSTANCES.map((c) => (
                <button
                  key={c}
                  onClick={() => toggle(recCircs, c, setRecCircs)}
                  className={cn(
                    "px-4 py-2 rounded-full border text-xs uppercase tracking-editorial transition-colors",
                    recCircs.has(c)
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Switch id="weather" checked={factorWeather} onCheckedChange={setFactorWeather} />
              <Label htmlFor="weather" className="text-xs uppercase tracking-editorial cursor-pointer">
                Factor in current weather
              </Label>
            </div>
            <Button
              onClick={getRecommendation}
              className="h-12 rounded-none text-xs uppercase tracking-editorial px-6"
            >
              Get Recommendation
            </Button>
          </div>
        </section>

        {/* Closet header + filters */}
        <div className="mt-16">
          <p className="text-xs uppercase tracking-editorial text-muted-foreground">Wardrobe</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-6xl">My Closet</h1>
        </div>

        <div className="mt-8">
          <p className="text-[10px] uppercase tracking-editorial text-muted-foreground">Filter by circumstance</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CIRCUMSTANCES.map((c) => (
              <Badge
                key={c}
                onClick={() => toggle(filter, c, setFilter)}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-1.5 text-[10px] uppercase tracking-editorial border transition-colors",
                  filter.has(c)
                    ? "bg-foreground text-background border-foreground hover:bg-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:text-foreground"
                )}
              >
                {c}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 grid-cols-2 lg:grid-cols-3">
          {filtered.map((it, i) => (
            <article key={it.name} className="group">
              <div className="aspect-[3/4] bg-secondary border border-border flex items-end p-4 sm:p-6">
                <span className="font-serif text-5xl sm:text-7xl text-muted-foreground/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="font-serif text-base sm:text-lg">{it.name}</h3>
                <span className="text-[10px] uppercase tracking-editorial text-muted-foreground">{it.category}</span>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-sm text-muted-foreground py-12">
              No pieces match the selected circumstances.
            </p>
          )}
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-none border-border max-w-lg">
          <DialogHeader>
            <DialogDescription className="text-[10px] uppercase tracking-editorial text-muted-foreground">
              Suggested Look
            </DialogDescription>
            <DialogTitle className="font-serif text-3xl">
              {loadingRec ? "Curating…" : rec?.title}
            </DialogTitle>
          </DialogHeader>

          {loadingRec ? (
            <div className="space-y-3 mt-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : rec ? (
            <div className="mt-4 space-y-6">
              <p className="text-sm text-muted-foreground italic">{rec.rationale}</p>
              <ul className="space-y-3">
                {rec.pieces.map((p) => (
                  <li key={p} className="flex items-center gap-4 border-b border-border pb-3">
                    <div className="h-12 w-12 bg-secondary border border-border" />
                    <span className="font-serif text-lg">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Closet;
