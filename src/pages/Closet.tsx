import { TopNav } from "@/components/TopNav";
import { useEffect } from "react";

const items = [
  { name: "Silk Slip Dress", category: "Dresses" },
  { name: "Wool Trench", category: "Outerwear" },
  { name: "Cashmere Knit", category: "Knitwear" },
  { name: "Tailored Trouser", category: "Bottoms" },
  { name: "Leather Loafer", category: "Footwear" },
  { name: "Linen Shirt", category: "Tops" },
];

const Closet = () => {
  useEffect(() => {
    document.title = "My Closet — Maison";
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-20">
        <p className="text-xs uppercase tracking-editorial text-muted-foreground">Wardrobe</p>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl">My Closet</h1>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <article key={it.name} className="group">
              <div className="aspect-[3/4] bg-secondary border border-border flex items-end p-6">
                <span className="font-serif text-7xl text-muted-foreground/40">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="font-serif text-lg">{it.name}</h3>
                <span className="text-[10px] uppercase tracking-editorial text-muted-foreground">{it.category}</span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Closet;
