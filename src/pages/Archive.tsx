import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Sparkles, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import { news, Card } from "./Dashboard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORIES = [
  "ALL",
  "LUXURY",
  "STREET STYLE",
  "ACCESSORIES",
  "SUSTAINABLE FASHION",
  "EDITORIAL PICKS",
  "MODERN MINIMALISM"
] as const;

const TRENDING_TAGS = [
  { num: "01", label: "Quiet Luxury" },
  { num: "02", label: "Paris Fashion Week" },
  { num: "03", label: "Tailored Elegance" },
  { num: "04", label: "Minimal Streetwear" },
  { num: "05", label: "Modern Icons" },
  { num: "06", label: "Timeless Accessories" },
  { num: "07", label: "Copenhagen Edit" },
  { num: "08", label: "Monochrome Dressing" },
  { num: "09", label: "The Return of Tailoring" },
  { num: "10", label: "Capsule Wardrobe" }
];

const Archive = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    document.title = "The Fashion Archive — StyleAI";
    window.scrollTo(0, 0);

    // Read saved status
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
    if (savedIds.includes(id)) {
      toast.success("Removed from bookmarks");
    } else {
      toast.success("Added to bookmarks");
    }
  };

  const getFilteredArticles = () => {
    // news has 13 articles total (1-12 are standard grid articles, 13 is Featured)
    let list = news.filter((n) => n.id >= 1 && n.id <= 12);

    if (searchQuery) {
      list = list.filter(
        (item) =>
          item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "ALL") {
      list = list.filter((item) => {
        const cat = selectedCategory.toLowerCase();
        const tag = item.tag.toLowerCase();
        if (cat === "luxury") return tag === "trend forecast";
        if (cat === "street style") return tag === "global inspiration" || tag === "style icons";
        if (cat === "accessories") return tag === "accessory edit";
        if (cat === "sustainable fashion") return tag === "sustainable style";
        if (cat === "editorial picks") return tag === "style icons" || tag === "trend forecast";
        if (cat === "modern minimalism") return tag === "wardrobe evolution";
        return true;
      });
    }

    return list;
  };

  const filteredArticles = getFilteredArticles();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans select-none overflow-x-hidden">

      {/* 1. Custom Luxury Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#D4AF37]/15 bg-[#050505]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">

          {/* Brand Logo with Orange Bullet & Outline Circle */}
          <Link to="/dashboard" className="flex items-center gap-3 relative group">
            <div className="flex flex-col">
              <span className="font-editorial-serif text-lg tracking-[0.1em] text-[#D4AF37] leading-none font-medium">
                STYLE AI
              </span>
              <span className="text-[7px] uppercase tracking-[0.3em] text-[#D4AF37]/70 font-semibold mt-1">
                FASHION EDITORIAL
              </span>
            </div>
            {/* Screenshot Special Effect: Top left circle outline next to brand */}
            <div className="absolute -top-1 -left-4 w-12 h-12 rounded-full border border-[#D4AF37]/10 pointer-events-none group-hover:border-[#D4AF37]/35 transition-colors duration-500" />
            <span className="absolute -top-1 -left-2 w-1.5 h-1.5 bg-[#D4AF37] rounded-full opacity-60" />
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.25em] font-semibold text-white/50">
            <button
              onClick={() => {
                const el = document.getElementById("all-editorials");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-white transition-colors uppercase cursor-pointer bg-transparent border-none p-0 font-semibold tracking-[0.25em]"
            >
              Collections
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("editorial-footer");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-white transition-colors uppercase cursor-pointer bg-transparent border-none p-0 font-semibold tracking-[0.25em]"
            >
              Features
            </button>
            <Link to="/archive" className="text-[#D4AF37] hover:text-white transition-colors relative py-1">
              Archive
              <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#D4AF37]" />
            </Link>
            <button
              onClick={() => {
                const el = document.getElementById("membership");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-white transition-colors uppercase cursor-pointer bg-transparent border-none p-0 font-semibold tracking-[0.25em]"
            >
              Membership
            </button>
          </nav>

          {/* Subscribe action */}
          <button
            onClick={() => {
              const el = document.getElementById("membership");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] px-5 py-2 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold bg-transparent hover:bg-[#D4AF37]/5 transition-all duration-300 cursor-pointer"
          >
            Subscribe
          </button>
        </div>
      </header>

      {/* 2. Hero Section with Slide-up Animation */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center overflow-hidden">
        {/* Background Image: slide up from bottom */}
        <div className="absolute inset-0 z-0">
          <img
            src="/archive-hero.png"
            alt="StyleAI Wardrobe Collection"
            className="w-full h-full object-cover opacity-35 animate-slide-up-bg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/45 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl px-5 flex flex-col items-center">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#D4AF37] font-bold mb-4 drop-shadow-md">
            The Complete Collection
          </p>
          <h1 className="font-editorial-serif text-5xl sm:text-7xl lg:text-8xl font-normal text-white/95 leading-[1.05] tracking-wide drop-shadow-lg">
            The Fashion <span className="italic text-[#D4AF37] font-editorial-serif pr-2">Archive</span>
          </h1>
          <p className="mt-6 max-w-lg text-white/60 font-editorial-serif text-base sm:text-lg lg:text-xl italic leading-relaxed drop-shadow-md">
            A curated collection of timeless editorials, modern luxury, and evolving style culture.
          </p>

          {/* Hero Action Buttons */}
          <div className="mt-10 flex items-center gap-4 flex-wrap justify-center">
            <button
              onClick={() => {
                const el = document.getElementById("search-filters");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#D4AF37] text-[#050505] px-7 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-glow hover:opacity-90 transition-all cursor-pointer"
            >
              Explore Archive
            </button>
            <button
              onClick={() => navigate("/article/13")}
              className="border border-[#D4AF37]/35 text-white hover:text-[#D4AF37] hover:border-[#D4AF37] px-7 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-transparent hover:bg-white/5 transition-all cursor-pointer"
            >
              Featured Story
            </button>
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <span className="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37]/70 font-semibold">

            </span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-[#D4AF37] to-transparent animate-bounce" />
          </div>
        </div>
      </section>

      {/* 3. Search & Category Filters */}
      <section id="search-filters" className="py-12 border-t border-[#D4AF37]/15 bg-[#050505] relative z-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col items-center">

          {/* Search bar pill */}
          <div className="w-full max-w-2xl relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search editorials, designers, trends..."
              className="w-full bg-[#0c0c0e]/85 border border-[#D4AF37]/20 rounded-full py-4 pl-14 pr-8 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all shadow-lg"
            />
          </div>

          {/* Category Capsules */}
          <div className="mt-8 flex flex-wrap gap-2.5 justify-center max-w-4xl">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2.5 rounded-full border text-[9px] font-bold tracking-[0.15em] transition-all cursor-pointer uppercase",
                  selectedCategory === cat
                    ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] shadow-glow"
                    : "border-white/10 bg-[#0c0c0e]/50 text-white/50 hover:text-white hover:border-white/20"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Stats Row */}
      <section className="py-12 bg-[#0c0c0e] border-y border-[#D4AF37]/15 relative z-10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 lg:gap-16 items-center justify-items-center text-center">

          <div className="flex flex-col">
            <span className="font-editorial-serif text-3.5xl sm:text-5xl text-[#D4AF37] font-medium leading-none">
              340+
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-semibold mt-3">
              Editorials
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-editorial-serif text-3.5xl sm:text-5xl text-white/90 font-medium leading-none">
              12
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-semibold mt-3">
              Seasons Archived
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-editorial-serif text-3.5xl sm:text-5xl text-white/90 font-medium leading-none">
              80+
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mt-3">
              Designers Featured
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-editorial-serif text-3.5xl sm:text-5xl text-[#D4AF37] font-medium leading-none">
              24K
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-semibold mt-3">
              Readers Monthly
            </span>
          </div>

        </div>
      </section>

      {/* 5. Featured Story (Editor's Choice) */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-5 sm:px-8 relative z-10 w-full">
        {/* Section Header */}
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold flex items-center gap-2">
              <span className="w-1 h-1 bg-[#D4AF37] rounded-full" />
              Featured Story
            </p>
            <h2 className="font-editorial-serif text-4xl sm:text-5xl font-medium text-white/90 leading-none mt-3.5">
              Editor's <span className="italic text-[#D4AF37] font-editorial-serif pr-1">Choice</span>
            </h2>
            <p className="text-white/40 text-xs mt-3 font-light">
              The story that defined this season's conversation.
            </p>
          </div>
          {/* Decorative Gold circle */}
          <div className="w-10 h-10 rounded-full border border-white/10 hidden sm:flex items-center justify-center text-[#D4AF37]">
            <Sparkles className="h-4 w-4 animate-spin-slow" />
          </div>
        </div>

        {/* Banner Layout */}
        <div className="rounded-[24px] overflow-hidden bg-[#0c0c0e] border border-[#D4AF37]/20 flex flex-col lg:flex-row shadow-2xl group hover:border-[#D4AF37]/45 transition-all duration-500">
          {/* Left panel: Image */}
          <div className="w-full lg:w-[55%] relative aspect-[16/10] lg:aspect-auto min-h-[300px] overflow-hidden">
            <img
              src="/editors-pick.jpg"
              alt="The Architecture of Silence"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000"
            />
            {/* Editor's pick pill overlay */}
            <div className="absolute top-6 left-6 z-10">
              <span className="bg-[#D4AF37] text-[#050505] px-4 py-1.5 rounded-full text-[8px] uppercase tracking-[0.2em] font-extrabold shadow-lg">
                Editor's Pick
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Right panel: Details */}
          <div className="w-full lg:w-[45%] p-8 sm:p-12 flex flex-col justify-center">
            <span className="text-[8px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1 rounded-full w-fit">
              Trend Forecast
            </span>
            <h3 className="font-editorial-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight text-white/90 mt-6 tracking-wide group-hover:text-white transition-colors">
              The Architecture of Silence: How Restraint Became Fashion's Loudest Statement
            </h3>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-white/50 font-light font-editorial-serif italic">
              In an era of relentless spectacle, the most radical act in fashion has become refusal — the refusal to announce, to embellish, to perform. A meditation on minimalism as the ultimate luxury.
            </p>
            <p className="mt-8 text-[10px] text-white/35 uppercase tracking-widest font-semibold">
              Isabelle Moreau &nbsp;•&nbsp; 8 Min Read &nbsp;•&nbsp; May 2026
            </p>

            <button
              onClick={() => navigate("/article/13")}
              className="mt-8 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505] text-[#D4AF37] px-6 py-3 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold w-fit bg-transparent transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-glow-hover"
            >
              Read Story &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* 6. All Editorials Section (Grid of 12 Cards) */}
      <section id="all-editorials" className="py-16 bg-[#050505] border-t border-[#D4AF37]/15 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          {/* Section Header */}
          <div className="mb-12">
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
              Complete Archive
            </p>
            <h2 className="font-editorial-serif text-4xl sm:text-5xl font-medium text-white/90 leading-none mt-3.5">
              All <span className="italic text-[#D4AF37] font-editorial-serif pr-1">Editorials</span>
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-3">
              <p className="text-white/40 text-xs font-light">
                Every story, every season, every voice that shaped the culture.
              </p>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]/80 font-bold bg-[#D4AF37]/5 border border-[#D4AF37]/20 px-3.5 py-1.5 rounded-full">
                Showing {filteredArticles.length} of 340 Editorials
              </span>
            </div>
          </div>

          {/* 12 Cards Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {filteredArticles.map((n) => (
                <div key={n.id} className="h-full">
                  <Card
                    n={n}
                    isSaved={savedIds.includes(n.id)}
                    onToggleSave={() => toggleSave(n.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-white/5 bg-[#0c0c0e]/40 rounded-[20px]">
              <p className="text-sm text-white/40 italic">No editorials match your search or filter criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ALL");
                }}
                className="mt-4 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] px-6 py-2.5 rounded-full text-[9px] uppercase tracking-[0.15em] font-bold transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 7. Trending Now Section */}
      <section className="py-16 sm:py-20 bg-[#0c0c0e] border-t border-[#D4AF37]/15 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center flex flex-col items-center">

          <p className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
            Trending Now
          </p>
          <h2 className="font-editorial-serif text-4xl sm:text-5xl font-medium text-white/90 leading-none mb-10">
            What the <span className="italic text-[#D4AF37] font-editorial-serif pr-1.5">World</span> is Reading
          </h2>

          {/* List of numbered tags */}
          <div className="flex flex-wrap gap-3.5 justify-center max-w-4xl">
            {TRENDING_TAGS.map((tag) => (
              <span
                key={tag.num}
                className="border border-white/10 px-5 py-3 rounded-full text-[10px] font-semibold tracking-[0.12em] text-white/80 bg-[#050505] flex items-center gap-2.5 transition-all duration-300 hover:border-[#D4AF37]/45 hover:text-white"
              >
                <span className="text-[#D4AF37] font-editorial-serif text-xs font-semibold">
                  {tag.num}
                </span>
                {tag.label}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* 8. Join The Editorial Circle (Membership Section) */}
      <section id="membership" className="py-24 bg-[#050505] border-t border-[#D4AF37]/15 relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center relative flex flex-col items-center">

          <div className="mb-4">
            <span className="border border-[#D4AF37]/35 bg-[#D4AF37]/5 text-[#D4AF37] px-10 py-2 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold">
              Membership
            </span>
          </div>
          <h2 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-white/95 leading-tight mt-6 tracking-wide">
            Join The <span className="italic text-[#D4AF37] font-editorial-serif pr-2">Editorial</span> Circle
          </h2>
          <p className="mt-5 max-w-xl text-white/60 font-editorial-serif text-base sm:text-lg italic leading-relaxed">
            Receive curated editorials, early access to features, and exclusive insider dispatches from the world of fashion.
          </p>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Thank you for joining the Editorial Circle!");
            }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl"
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              className="w-full sm:w-1/2 h-14 bg-[#0c0c0e] border border-[#D4AF37]/30 focus:border-[#D4AF37]/70 rounded-full px-8 text-sm text-white placeholder-white/20 focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 h-14 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-semibold text-[11px] tracking-[0.25em] px-16 rounded-full transition-all cursor-pointer"
            >
              SUBSCRIBE &rarr;
            </button>
          </form>

          <p className="mt-6 text-[9px] uppercase tracking-widest text-white/30">
            No spam. Unsubscribe anytime. &nbsp;•&nbsp; Trusted by 24,000 readers.
          </p>
        </div>
      </section>

      {/* 9. Editorial Footer */}
      <footer id="editorial-footer" className="py-20 bg-[#0c0c0e] border-t border-[#D4AF37]/15 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-12 border-b border-white/5">

            {/* Left brand details */}
            <div className="md:col-span-5 flex flex-col justify-start">
              <span className="font-editorial-serif text-xl tracking-[0.1em] text-[#D4AF37] leading-none font-medium">
                STYLE AI
              </span>
              <p className="mt-5 max-w-sm text-[12px] leading-relaxed text-white/40 font-light font-editorial-serif italic">
                A premium fashion editorial exploring the intersection of luxury, culture, and personal style.
              </p>
              {/* Social icons */}
              <div className="mt-6 flex items-center gap-3">
                {[
                  { name: "instagram", Icon: Instagram },
                  { name: "twitter", Icon: Twitter },
                  { name: "linkedin", Icon: Linkedin },
                  { name: "youtube", Icon: Youtube }
                ].map(({ name, Icon }) => (
                  <a
                    key={name}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.success(`StyleAI on ${name.toUpperCase()} coming soon!`);
                    }}
                    className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/45 text-white/60 hover:text-[#D4AF37] transition-all duration-300 group"
                  >
                    <Icon className="h-3.5 w-3.5 text-white/60 group-hover:text-[#D4AF37] transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Navigation Columns */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
                Editorial
              </span>
              <div className="flex flex-col gap-2.5 text-xs text-white/45">
                <Link to="/dashboard" className="hover:text-white transition-colors">Latest Features</Link>
                <Link to="/dashboard" className="hover:text-white transition-colors">Trend Reports</Link>
                <Link to="/dashboard" className="hover:text-white transition-colors">Style Guides</Link>
                <Link to="/dashboard" className="hover:text-white transition-colors">Sustainability</Link>
                <Link to="/dashboard" className="hover:text-white transition-colors">Beauty Edit</Link>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-4">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
                Discover
              </span>
              <div className="flex flex-col gap-2.5 text-xs text-white/45">
                <Link to="/closet" className="hover:text-white transition-colors">Designers</Link>
                <Link to="/closet" className="hover:text-white transition-colors">Collections</Link>
                <Link to="/closet" className="hover:text-white transition-colors">Fashion Week</Link>
                <Link to="/closet" className="hover:text-white transition-colors">Street Style</Link>
                <Link to="/archive" className="hover:text-white transition-colors">Archive</Link>
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col gap-4">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
                Style AI
              </span>
              <div className="flex flex-col gap-2.5 text-xs text-white/45">
                <Link to="/profile" className="hover:text-white transition-colors">About</Link>
                <Link to="/profile" className="hover:text-white transition-colors">Contributors</Link>
                <Link to="/closet" className="hover:text-white transition-colors">Membership</Link>
                <Link to="/dashboard" className="hover:text-white transition-colors">Advertise</Link>
                <Link to="/profile" className="hover:text-white transition-colors">Contact</Link>
              </div>
            </div>

          </div>

          {/* Footer Copyright */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-white/35 uppercase tracking-widest font-medium">
            <span>&copy; 2026 StyleAI Editorial. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-[#D4AF37] transition-colors font-semibold">Cookie Preferences</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Archive;