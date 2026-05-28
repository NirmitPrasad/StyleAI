import { TopNav } from "@/components/TopNav";
import { useWeather } from "@/components/WeatherWidget";
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
import { news, Card } from "./Dashboard";

const CIRCUMSTANCES = ["☕ Casual", "✨ Party", "🖤 Formal", "💪 Workout", "☀️ Summer", "❄️ Winter", "🔖 Articles",] as const;
type Circumstance = (typeof CIRCUMSTANCES)[number];

const items = [
  { name: "Effortless Everyday", category: "Easy Elegance", tags: ["Casual"], image: "/effortless.jpeg" },
  { name: "Weekend Ease", category: "Off-Duty Glow", tags: ["Casual"], image: "/weekend.jpeg" },
  { name: "Relaxed Refinement", category: "Soft Sophistication", tags: ["Casual"], image: "/relaxed.jpeg" },
  { name: "Off-Duty Chic", category: "Casual Glam", tags: ["Casual"], image: "/off duty.jpeg" },
  { name: "Modern Comfort", category: "Luxe Comfort", tags: ["Casual"], image: "/modern.jpeg" },
  { name: "Everyday Essentials", category: "Timeless Basics", tags: ["Casual"], image: "/everyday.jpeg" },
  { name: "After-Dark Glamour", category: "Evening Allure", tags: ["Party"], image: "/after dark.jpeg" },
  { name: "Midnight Alive", category: "Dark Romance", tags: ["Party"], image: "/midnight.jpeg" },
  { name: "Celebration Edit", category: "Glamour Nights", tags: ["Party"], image: "/celebration.jpeg" },
  { name: "Evening Radiance", category: "Startlit Glow", tags: ["Party"], image: "/evening.jpeg" },
  { name: "Statement Style", category: "Fashion Forward", tags: ["Party"], image: "/statement.jpeg" },
  { name: "Night-Out Luxe", category: "Luxe Nights", tags: ["Party"], image: "/night out.jpeg" },
  { name: "Power Dressing", category: "Elite Tailoring", tags: ["Formal"], image: "/power.jpeg" },
  { name: "Executive Elegance", category: "Prestige Style", tags: ["Formal"], image: "/executive.jpeg" },
  { name: "Timeless Tailoring", category: "Heritage Chic", tags: ["Formal"], image: "/timeless.jpeg" },
  { name: "Polished Perfection", category: "Elegant Finish", tags: ["Formal"], image: "/polished.jpeg" },
  { name: "Modern Sophistication", category: "Modern Muse", tags: ["Formal"], image: "/modernso.jpeg" },
  { name: "Refined Authority", category: "Elite Presence", tags: ["Formal"], image: "/refined.jpg" },
  { name: "Performance Essentials", category: "Elevated Activewear", tags: ["Workout"], image: "/performance.jpeg" },
  { name: "Active Momentum", category: "Active Glam", tags: ["Workout"], image: "/active.jpeg" },
  { name: "Studio Ready", category: "Core Energy", tags: ["Workout"], image: "/studio ready.jpeg" },
  { name: "Athletic Edge", category: "Strength Style", tags: ["Workout"], image: "/atheletic.jpeg" },
  { name: "Dynamic Motion", category: "Athletic Prestige", tags: ["Workout"], image: "/dynamic.jpeg" },
  { name: "Strength in Style", category: "Active Aura", tags: ["Workout"], image: "/strength.jpeg" },
  { name: "Sunlit Elegance", category: "Golden Glow", tags: ["Summer"], image: "/sunlit.jpeg" },
  { name: "Warm-Weather Luxe", category: "Vacation Edit", tags: ["Summer"], image: "/warm.jpeg" },
  { name: "Coastal Chic", category: "Beachside Luxe", tags: ["Summer"], image: "/coastal.jpeg" },
  { name: "Breezy Sophistication", category: "Effortless Escape", tags: ["Summer"], image: "/breezy.jpeg" },
  { name: "Summer Escape", category: "Holiday Edit", tags: ["Summer"], image: "/summer.jpeg" },
  { name: "Golden Hour Style", category: "Dusk Elegance", tags: ["Summer"], image: "/golden.jpeg" },
  { name: "Cold-Weather Couture", category: "Cozy Prestige", tags: ["Winter"], image: "/cold.jpeg" },
  { name: "Cozy Luxury", category: "Winter Glam", tags: ["Winter"], image: "/cozy.jpeg" },
  { name: "Winter Elegance", category: "Cozy Refinement", tags: ["Winter"], image: "/winter.jpeg" },
  { name: "Layered Refinement", category: "Refined Comfort", tags: ["Winter"], image: "/layered.jpeg" },
  { name: "Frosted Chic", category: "Soft Minimalism", tags: ["Winter"], image: "/frosted.jpeg" },
  { name: "Seasonal Sophistication", category: "Elegant Transitions", tags: ["Winter"], image: "/seasonal.jpeg" },
];

const Closet = () => {
  const [filter, setFilter] = useState<Circumstance | null>(null);
  const [recCircs, setRecCircs] = useState<Set<Circumstance>>(new Set());
  const [factorWeather, setFactorWeather] = useState(true);
  const [loadingRec, setLoadingRec] = useState(false);
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [open, setOpen] = useState(false);
  const { weather } = useWeather();

  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    document.title = "My Closet — StyleAI";
    const saved = localStorage.getItem("styleai_saved_articles");
    if (saved) {
      try {
        setSavedIds(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggle = (set: Set<Circumstance>, c: Circumstance, setter: (s: Set<Circumstance>) => void) => {
    const next = new Set(set);
    if (next.has(c)) {
      next.delete(c);
    } else {
      next.add(c);
    }
    setter(next);
  };

  const toggleSave = (id: number) => {
    const next = savedIds.includes(id)
      ? savedIds.filter((x) => x !== id)
      : [...savedIds, id];
    setSavedIds(next);
    localStorage.setItem("styleai_saved_articles", JSON.stringify(next));
  };

  const filtered = !filter ? items : items.filter((i) => i.tags.includes(filter.split(" ")[1]));

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
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Recommendation failed");
      setOpen(false);
    } finally {
      setLoadingRec(false);
    }
  };

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-8 sm:py-12">

        {/* Style Concierge */}
        <section className="mt-10 rounded-3xl border border-border bg-card/60 backdrop-blur p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Style Concierge</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Style Your Next Outfit</h2>
          <p className="mt-2 text-muted-foreground font-serif italic text-lg sm:text-xl">
            Personalized outfit recommendations tailored to your occasion, weather, and style.
          </p>

          <div className="mt-8">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">OCCASION</Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {CIRCUMSTANCES.map((c) => (
                <button
                  key={c}
                  onClick={() => toggle(recCircs, c, setRecCircs)}
                  className={cn(
                    "px-4 py-2 rounded-full border text-xs font-semibold transition-all",
                    recCircs.has(c)
                      ? "bg-gradient-primary text-black border-transparent shadow-glow"
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
                Dress for today's weather!
              </Label>
            </div>
            <Button
              onClick={getRecommendation}
              className="rounded-xl bg-gradient-primary text-black px-6 h-12 shadow-glow hover:opacity-90"
            >
              <Sparkles className="mr-2 h-4 w-4" /> Show My Outfit
            </Button>
          </div>
        </section>

        {/* Closet header */}
        <div className="mt-12">
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold">Wardrobe <span className="text-gradient">Essentials</span></h1>
        </div>

        <div className="mt-3">
          <p className="mt-2 text-muted-foreground font-serif italic text-lg sm:text-xl">
            It feels sophisticated, modern, and perfectly alihned with a premium styling platform.
          </p>
          <div className="mt-8">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Style by Occasion</Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {CIRCUMSTANCES.map((c) => (
                <Badge
                  key={c}
                  onClick={() => setFilter(filter === c ? null : c)}
                  className={cn(
                    "cursor-pointer rounded-full px-4 py-1.5 text-[11px] font-semibold border transition-all",
                    filter === c
                      ? "bg-gradient-primary text-black border-transparent shadow-glow hover:opacity-90"
                      : "bg-secondary/60 text-muted-foreground border-border hover:text-foreground"
                  )}
                >
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className={cn(
          "mt-8 grid gap-5",
          filter === "🔖 Articles" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4"
        )}>
          {filter === "🔖 Articles" ? (
            news.filter((n) => savedIds.includes(n.id)).map((n) => (
              <Card
                key={n.id}
                n={n}
                isSaved={true}
                onToggleSave={() => toggleSave(n.id)}
              />
            ))
          ) : (
            filtered.map((it, i) => (
              <article key={it.name} className="group rounded-2xl border border-border bg-card/60 backdrop-blur overflow-hidden hover:border-primary/40 transition-colors">
                <div className="aspect-[3/4] bg-gradient-to-br from-secondary to-secondary/40 flex items-end p-5 relative">
                  {it.image && (
                    <img src={it.image} alt={it.name} className="absolute inset-0 w-full h-full object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-500" />
                  )}
                  {/* Dark gradient overlay so text remains readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl pointer-events-none" />
                  <span className="font-bold text-5xl text-white/60 drop-shadow-md relative z-10">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm">{it.name}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{it.category}</p>
                </div>
              </article>
            ))
          )}
          {((filter === "🔖 Articles" && news.filter((n) => savedIds.includes(n.id)).length === 0) ||
            (filter !== "🔖 Articles" && filtered.length === 0)) && (
            <p className="col-span-full text-center text-sm text-muted-foreground py-12">
              {filter === "🔖 Articles" ? "No saved articles." : "No pieces match the selected circumstances."}
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
