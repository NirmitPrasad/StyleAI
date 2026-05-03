import { TopNav } from "@/components/TopNav";
import { WeatherWidget } from "@/components/WeatherWidget";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const Card = ({ n, aspect }: { n: typeof news[number]; aspect: string }) => (
  <article className="rounded-2xl overflow-hidden border border-border bg-card/60 backdrop-blur hover:border-primary/40 transition-colors">
    <div className={`overflow-hidden bg-secondary ${aspect}`}>
      <img src={n.img} alt={n.headline} className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
    </div>
    <div className="p-5">
      <span className="inline-block rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-primary font-semibold">{n.tag}</span>
      <h3 className="mt-3 font-bold text-lg leading-snug">{n.headline}</h3>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{n.summary}</p>
    </div>
  </article>
);

const Dashboard = () => {
  useEffect(() => { document.title = "Home — StyleAI"; }, []);

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-8 sm:py-12">
        <WeatherWidget />

        <section className="mt-10 rounded-3xl border border-border bg-card/40 backdrop-blur p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Issue 26 · This Week</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold">
            Latest Trending<br />
            <span className="text-gradient">Fashion News</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground text-sm">A curated edit of the runway moments, designers and movements shaping right now.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/stylist"><Button className="rounded-xl bg-gradient-primary text-white shadow-glow hover:opacity-90">Open AI Stylist <ArrowRight className="ml-2 h-4 w-4"/></Button></Link>
            <Link to="/closet"><Button variant="outline" className="rounded-xl bg-secondary/40">My Closet</Button></Link>
          </div>
        </section>

        {/* Mobile carousel */}
        <div className="mt-10 -mx-5 sm:hidden">
          <div className="flex gap-4 overflow-x-auto px-5 pb-4 snap-x snap-mandatory scrollbar-hide">
            {news.map((n) => (
              <div key={n.id} className="snap-start shrink-0 w-[82%]">
                <Card n={n} aspect="aspect-[4/5]" />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop masonry */}
        <div className="mt-10 hidden sm:block">
          <div className="columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {news.map((n, i) => (
              <div key={n.id} className="mb-6 break-inside-avoid">
                <Card n={n} aspect={i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-square" : "aspect-[3/4]"} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
