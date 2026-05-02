import { TopNav } from "@/components/TopNav";
import { WeatherWidget } from "@/components/WeatherWidget";
import { useEffect } from "react";

const news = [
  {
    id: 1,
    headline: "Quiet Luxury Reigns at Milan Fashion Week",
    summary: "Understated tailoring and muted palettes dominate the runways as designers double down on timeless craft.",
    tag: "Runway",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
  },
  {
    id: 2,
    headline: "The Return of the Power Shoulder",
    summary: "Sculpted silhouettes from the 80s find a refined, modern voice in this season's tailoring.",
    tag: "Trends",
    img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
  },
  {
    id: 3,
    headline: "Sustainable Couture: A New Vanguard",
    summary: "Emerging houses are rewriting luxury with regenerative materials and zero-waste atelier methods.",
    tag: "Sustainability",
    img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
  },
  {
    id: 4,
    headline: "Streetwear Meets the Salon",
    summary: "Hybrid collections blur the line between sportswear ease and ready-to-wear elegance.",
    tag: "Culture",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
  },
  {
    id: 5,
    headline: "Accessory of the Season: The Sculptural Bag",
    summary: "Hand-formed leather and architectural hardware define the most coveted carryalls of SS26.",
    tag: "Accessories",
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
  },
];

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard — Maison";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-10 sm:py-16">
        <WeatherWidget />

        <div className="mt-12 sm:mt-16">
          <p className="text-xs uppercase tracking-editorial text-muted-foreground">Issue No. 26</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-6xl leading-[0.95]">
            Latest Trending<br />
            <span className="italic text-muted-foreground">Fashion News</span>
          </h1>
        </div>

        {/* Mobile: horizontal carousel */}
        <div className="mt-10 -mx-5 sm:hidden">
          <div className="flex gap-4 overflow-x-auto px-5 pb-4 snap-x snap-mandatory scrollbar-hide">
            {news.map((n) => (
              <article
                key={n.id}
                className="snap-start shrink-0 w-[80%] border border-border bg-card"
              >
                <div className="aspect-[4/5] overflow-hidden bg-secondary">
                  <img src={n.img} alt={n.headline} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-editorial text-muted-foreground">{n.tag}</p>
                  <h3 className="mt-3 font-serif text-xl leading-snug">{n.headline}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{n.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Desktop: masonry-ish */}
        <div className="mt-10 hidden sm:block">
          <div className="columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {news.map((n, i) => (
              <article key={n.id} className="mb-6 break-inside-avoid border border-border bg-card">
                <div
                  className={`overflow-hidden bg-secondary ${
                    i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-square" : "aspect-[3/4]"
                  }`}
                >
                  <img src={n.img} alt={n.headline} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
                </div>
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-editorial text-muted-foreground">{n.tag}</p>
                  <h3 className="mt-3 font-serif text-2xl leading-snug">{n.headline}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{n.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
