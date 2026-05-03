import { TopNav } from "@/components/TopNav";
import { WeatherWidget, useWeather } from "@/components/WeatherWidget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { recommendOutfit, type Recommendation } from "@/lib/api";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";

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

const Closet = () => {
  const [filter, setFilter] = useState<Set<Circumstance>>(new Set());
  const [recCircs, setRecCircs] = useState<Set<Circumstance>>(new Set());
  const [factorWeather, setFactorWeather] = useState(true);
  const [loadingRec, setLoadingRec] = useState(false);
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [open, setOpen] = useState(false);
  const { weather } = useWeather();

  useEffect(() => { document.title = "My Closet — StyleAI"; }, []);

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
    try {
      const r = await recommendOutfit({
        circumstances: Array.from(recCircs),
        factorWeather,
        weather,
        items,
      });
      setRec(r);
    } catch (e: any) {
      toast.error(e.message || "Recommendation failed");
      setOpen(false);
    } finally {
      setLoadingRec(false);
    }
  };

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-8 sm:py-12">
        <WeatherWidget />

        {/* Style Concierge */}
        <section className="mt-10 rounded-3xl border border-border bg-card/60 backdrop-blur p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Style Concierge</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold">What should I wear?</h2>

          <div className="mt-6">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Circumstance</Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {CIRCUMSTANCES.map((c) => (
                <button
                  key={c}
                  onClick={() => toggle(recCircs, c, setRecCircs)}
                  className={cn(
                    "px-4 py-2 rounded-full border text-xs font-semibold transition-all",
                    recCircs.has(c)
                      ? "bg-gradient-primary text-white border-transparent shadow-glow"
                      : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Switch id="weather" checked={factorWeather} onCheckedChange={setFactorWeather} />
              <Label htmlFor="weather" className="text-sm cursor-pointer">
                Factor in current weather
              </Label>
            </div>
            <Button
              onClick={getRecommendation}
              className="rounded-xl bg-gradient-primary text-white px-6 h-12 shadow-glow hover:opacity-90"
            >
              <Sparkles className="mr-2 h-4 w-4" /> Get Recommendation
            </Button>
          </div>
        </section>

        {/* Closet header */}
        <div className="mt-12">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Wardrobe</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold">My <span className="text-gradient">Closet</span></h1>
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Filter by circumstance</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CIRCUMSTANCES.map((c) => (
              <Badge
                key={c}
                onClick={() => toggle(filter, c, setFilter)}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-1.5 text-[11px] font-semibold border transition-all",
                  filter.has(c)
                    ? "bg-gradient-primary text-white border-transparent shadow-glow hover:opacity-90"
                    : "bg-secondary/60 text-muted-foreground border-border hover:text-foreground"
                )}
              >
                {c}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 grid-cols-2 lg:grid-cols-4">
          {filtered.map((it, i) => (
            <article key={it.name} className="group rounded-2xl border border-border bg-card/60 backdrop-blur overflow-hidden hover:border-primary/40 transition-colors">
              <div className="aspect-[3/4] bg-gradient-to-br from-secondary to-secondary/40 flex items-end p-5">
                <span className="font-bold text-5xl text-muted-foreground/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm">{it.name}</h3>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{it.category}</p>
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
        <DialogContent className="rounded-3xl border-border max-w-lg bg-card">
          <DialogHeader>
            <DialogDescription className="text-xs uppercase tracking-widest text-primary font-semibold">
              Suggested Look
            </DialogDescription>
            <DialogTitle className="text-3xl font-bold">
              {loadingRec ? "Curating…" : rec?.title}
            </DialogTitle>
          </DialogHeader>

          {loadingRec ? (
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> Asking the AI stylist…
              </div>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          ) : rec ? (
            <div className="mt-4 space-y-6">
              <p className="text-sm text-muted-foreground italic">{rec.rationale}</p>
              <ul className="space-y-3">
                {rec.pieces.map((p) => (
                  <li key={p} className="flex items-center gap-4 rounded-xl border border-border bg-secondary/40 p-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-primary/20 border border-border" />
                    <span className="font-semibold">{p}</span>
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
