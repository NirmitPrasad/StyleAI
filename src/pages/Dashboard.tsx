import { TopNav } from "@/components/TopNav";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const news = [
  {
    id: 1,
    headline: "The New Language of Luxury",
    summary: "How quiet luxury, refined tailoring, and understated elegance are redefining modern fashion for the discerning eye.",
    tag: "Trend Forecast",
    readTime: "6 min read",
    colorClass: "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10",
    img: "/trend.jpeg",
  },
  {
    id: 2,
    headline: "Conscious Fashion, Beautifully Crafted",
    summary: "Brands and designers creating timeless pieces through ethical craftsmanship and sustainable innovation.",
    tag: "Sustainable Style",
    readTime: "5 min read",
    colorClass: "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10",
    img: "/sustainable.jpeg",
  },
  {
    id: 3,
    headline: "Modern Muse: The Art of Personal Style",
    summary: "Contemporary style icons shaping global fashion with individuality, confidence, and effortless elegance.",
    tag: "Style Icons",
    readTime: "4 min read",
    colorClass: "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10",
    img: "/style.jpeg",
  },
  {
    id: 4,
    headline: "The Return of Power Dressing",
    summary: "Structured silhouettes, elevated essentials, and polished tailoring for the modern woman's wardrobe.",
    tag: "Wardrobe Evolution",
    readTime: "5 min read",
    colorClass: "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10",
    img: "/wardrobe.jpeg",
  },
  {
    id: 5,
    headline: "Investment Pieces Worth Collecting",
    summary: "From sculptural handbags to timeless jewelry — accessories that transcend seasons and define enduring style.",
    tag: "Accessory Edit",
    readTime: "4 min read",
    colorClass: "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10",
    img: "/accessory.jpeg",
  },
  {
    id: 6,
    headline: "Fashion Capitals: Street Style Reimagined",
    summary: "A visual journey through inspiring looks from Paris, Milan, Copenhagen, Seoul, and beyond.",
    tag: "Global Inspiration",
    readTime: "7 min read",
    colorClass: "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10",
    img: "/global.jpeg",
  },
  {
    id: 7,
    headline: "The Art of Slow Living: Wardrobe Curation",
    summary: "How choosing mindfulness and building a minimalist closet leads to more intentional styling and sustainable luxury.",
    tag: "Sustainable Style",
    readTime: "6 min read",
    colorClass: "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10",
    img: "/relaxed.jpeg",
  },
  {
    id: 8,
    headline: "After-Dark Sophistication: The Evening Edit",
    summary: "Exploring dramatic silhouettes, rich fabrics, and effortless elegance for evening luxury dressing.",
    tag: "Style Icons",
    readTime: "5 min read",
    colorClass: "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10",
    img: "/after dark.jpeg",
  },
  {
    id: 9,
    headline: "Winter Couture: Layering Like a Stylist",
    summary: "A masterclass in texture pairing, proportions, and outerwear styling for the coldest seasons.",
    tag: "Wardrobe Evolution",
    readTime: "8 min read",
    colorClass: "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10",
    img: "/cozy.jpeg",
  },
  {
    id: 10,
    headline: "Warm-Weather Escape: Coastal Minimalism",
    summary: "Lightweight fabrics, sun-drenched palettes, and effortless styling for summer travel and leisure.",
    tag: "Sustainable Style",
    readTime: "4 min read",
    colorClass: "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10",
    img: "/coastal.jpeg",
  },
  {
    id: 11,
    headline: "Refined Authority: Timeless Workwear",
    summary: "How classic tailored pieces, structured shirts, and fine accessories construct a confident business wardrobe.",
    tag: "Wardrobe Evolution",
    readTime: "6 min read",
    colorClass: "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10",
    img: "/refined.jpg",
  },
  {
    id: 12,
    headline: "The Statement Coat: Styling Outerwear",
    summary: "From sculptural double-breasted wool to relaxed trenches — outerwear that defines your entire silhouette.",
    tag: "Accessory Edit",
    readTime: "5 min read",
    colorClass: "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10",
    img: "/statement.jpeg",
  },
  {
    id: 13,
    headline: "The Architecture of Silence: How Restraint Became Fashion's Loudest Statement",
    summary: "In an era of relentless spectacle, the most radical act in fashion has become refusal — the refusal to announce, to embellish, to perform. A meditation on minimalism as the ultimate luxury.",
    tag: "Trend Forecast",
    readTime: "8 min read",
    colorClass: "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10",
    img: "/editors-pick.jpg",
  },
];

export const Card = ({
  n,
  isSaved,
  onToggleSave,
}: {
  n: typeof news[number];
  isSaved: boolean;
  onToggleSave: () => void;
}) => (
  <article className="group h-full flex flex-col rounded-[20px] overflow-hidden bg-[#0c0c0e] border border-[#D4AF37]/20 transition-all duration-500 hover:border-[#D4AF37]/50 hover:bg-[#121215] shadow-lg">
    <div className="relative h-64 shrink-0 overflow-hidden">
      <img src={n.img} alt={n.headline} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
      {/* Smooth gradient fade out at bottom of image matching the card bg */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/60 to-transparent group-hover:from-[#121215] group-hover:via-[#121215]/60 transition-colors duration-500" />
      
      {/* Bookmark icon positioned at top right */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleSave();
        }}
        className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-black/60 transition-all cursor-pointer z-10"
      >
        <Bookmark className={cn("h-4 w-4 transition-all", isSaved ? "text-[#D4AF37] fill-[#D4AF37]" : "text-white/80")} />
      </button>

      {/* Tag positioned over image */}
      <div className="absolute bottom-4 left-6">
        <span className={`inline-block rounded-full border px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] font-bold backdrop-blur-sm ${n.colorClass}`}>
          {n.tag}
        </span>
      </div>
    </div>
    
    <div className="px-6 pb-6 pt-2 flex-grow flex flex-col">
      <h3 className="font-serif text-xl sm:text-2xl font-medium leading-snug text-white/90">{n.headline}</h3>
      <p className="mt-4 text-[13px] leading-relaxed text-white/40 font-light">{n.summary}</p>
      
      <div className="mt-auto pt-6 flex items-center justify-between">
        <Link to={`/article/${n.id}`} className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold hover:opacity-80 transition-opacity">
          Read More &rarr;
        </Link>
        <span className="text-[10px] uppercase tracking-widest text-white/30">{n.readTime}</span>
      </div>
    </div>
  </article>
);

const Dashboard = () => {
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    document.title = "Home — StyleAI";
    const saved = localStorage.getItem("styleai_saved_articles");
    if (saved) {
      try {
        setSavedIds(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleSave = (id: number) => {
    const next = savedIds.includes(id)
      ? savedIds.filter((x) => x !== id)
      : [...savedIds, id];
    setSavedIds(next);
    localStorage.setItem("styleai_saved_articles", JSON.stringify(next));
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <TopNav />
      <main className="mx-auto max-w-[1200px] px-5 sm:px-8 py-10 sm:py-16">
        {/* Elegant header section */}
        <section className="mb-20 text-center flex flex-col items-center">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-6">
            The Style Journal
          </p>
          <h1 className="text-5xl sm:text-7xl font-serif text-white/90 tracking-tight leading-[1.1]">
            Fashion<br />
            <span className="italic text-[#D4AF37] font-serif pr-4">Intelligence</span>
          </h1>
          <p className="mt-8 max-w-lg text-white/40 text-sm sm:text-base font-light">
            Curated insights, emerging trends, and timeless inspiration from the world of style.
          </p>
        </section>

        {/* Mobile carousel */}
        <div className="mt-10 -mx-5 sm:hidden">
          <div className="flex gap-4 overflow-x-auto px-5 pb-8 snap-x snap-mandatory scrollbar-hide">
            {news.slice(0, 6).map((n) => (
              <div key={n.id} className="snap-start shrink-0 w-[85%]">
                <Card
                  n={n}
                  isSaved={savedIds.includes(n.id)}
                  onToggleSave={() => toggleSave(n.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <div className="mt-10 hidden sm:block">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {news.slice(0, 6).map((n) => (
              <div key={n.id} className="mb-6">
                <Card
                  n={n}
                  isSaved={savedIds.includes(n.id)}
                  onToggleSave={() => toggleSave(n.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Archive Link */}
        <div className="mt-16 mb-12 text-center">
          <Link to="/archive" className="inline-block text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF37] hover:text-white transition-colors duration-300">
            Explore the full archive &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;