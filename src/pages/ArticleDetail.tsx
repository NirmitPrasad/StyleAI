import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Bookmark, Heart, Sparkles } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { news } from "./Dashboard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ArticleContent {
  subtitle: string;
  authorInitials: string;
  authorName: string;
  authorSub: string;
  dropCap: string;
  firstParagraphRemainder: string;
  pullQuote: string;
  paragraphs: string[];
  tags: string[];
}

const articleContents: Record<number, ArticleContent> = {
  1: {
    subtitle: "Refinement is not extravagance. It is the discipline of elimination, the courage of restraint.",
    authorInitials: "SC",
    authorName: "Sophia Chambers",
    authorSub: "May 2026 - Maison Editorial",
    dropCap: "T",
    firstParagraphRemainder: "here is a quietness to the most compelling wardrobes of our time — a studied restraint that speaks more fluently than the loudest logomania. The shift has been gradual, almost imperceptible, yet its arrival is undeniable. We are in the age of quiet luxury.",
    pullQuote: "The truly discerning eye requires no embellishment. The cut alone declares the intention.",
    paragraphs: [
      "The movement finds its roots in a collective fatigue — a turning away from the performative, the ostentatious, the exhaustingly visible. In its place, a new vocabulary has emerged: the weight of a proper wool, the drape of untreated linen, the particular satisfaction of a coat that fits as if it were sculpted for the individual, not the crowd. It is fashion as a private confidence, not a public declaration.",
      "This is the new language of luxury: not the vocabulary of excess, but the grammar of intention. Each piece is chosen not for what it signals to others, but for what it means to the self. The wardrobe serves as an autobiography, written in cloth and cut and the particular way light falls across an impeccably tailored shoulder."
    ],
    tags: ["Quiet Luxury", "Tailoring", "Editorial", "Spring 2026", "Minimalism"]
  },
  2: {
    subtitle: "Sustainability is no longer a footnote; it is the blueprint. True beauty lies in the integrity of the process.",
    authorInitials: "MV",
    authorName: "Marcus Vance",
    authorSub: "June 2026 - Eco-Luxe Digest",
    dropCap: "I",
    firstParagraphRemainder: "n an industry long defined by speed and obsolescence, a quiet revolution is taking hold. Designers are no longer just asking how a garment looks, but how it lives—where it comes from, who made it, and where it will go when its season ends.",
    pullQuote: "We do not inherit the earth from our ancestors; we borrow it from our children. Our clothing should reflect that stewardship.",
    paragraphs: [
      "This conscious shift is breathing new life into ancient techniques. Organic linens, zero-waste pattern drafting, and closed-loop dyeing processes are transitioning from niche novelties to core design tenets. The modern wardrobe is becoming a collection of stories, where each piece carries the history of its clean origin and ethical creation.",
      "By choosing pieces crafted with care and built to endure, we reclaim fashion as an art form. It is a daily decision to value quality over quantity, craftsmanship over convenience, and the enduring beauty of our planet over fleeting, disposable trends."
    ],
    tags: ["Eco-Luxury", "Craftsmanship", "Slow Fashion", "Circular Design", "Heritage"]
  },
  3: {
    subtitle: "Style is a way to say who you are without having to speak. It is the ultimate expression of the self.",
    authorInitials: "ER",
    authorName: "Elena Rostova",
    authorSub: "April 2026 - Persona Magazine",
    dropCap: "P",
    firstParagraphRemainder: "ersonal style is not about following rules or replicating mannequins; it is about self-discovery and the courage to project your inner world outward. The most memorable style icons of today do not wear outfits—they inhabit them.",
    pullQuote: "Fashion is the armor to survive the reality of everyday life. Style is the spark that makes it beautiful.",
    paragraphs: [
      "To build a truly personal style is to cultivate a relationship with yourself. It requires experimenting with silhouettes, understanding the colors that make you feel alive, and curating a wardrobe that resonates with your personal narrative. It is an ongoing dialogue between your mood, your environment, and your aspirations.",
      "When we dress with intention, we stand taller and move with greater confidence. Our clothes become a form of creative expression, a visual symphony that celebrates our individuality in a world that often demands conformity."
    ],
    tags: ["Self-Expression", "Style Identity", "Creative Dressing", "Iconic Looks", "Confidence"]
  },
  4: {
    subtitle: "Power dressing is not about blending in or seeking permission. It is about claiming space with structure, form, and absolute intent.",
    authorInitials: "VS",
    authorName: "Victoria Sterling",
    authorSub: "May 2026 - Executive Style",
    dropCap: "T",
    firstParagraphRemainder: "he modern uniform has evolved far beyond the rigid constraints of the corporate uniform. Today's power dressing is defined by structured shoulders, fluid lines, and elevated essentials that command respect while embracing individuality.",
    pullQuote: "Strength and elegance are not mutually exclusive. A perfectly tailored blazer is both a shield and a statement.",
    paragraphs: [
      "As the boundary between workspace and personal space blurs, our clothing acts as a psychological anchor. Structured trousers, crisp oversized button-downs, and clean monochrome palettes provide a sense of control and readiness. It is styling designed to project competence and focus, without sacrificing comfort or personal flair.",
      "By choosing pieces that balance strength with sophistication, we define our own terms of engagement. It is fashion as a tool of empowerment, allowing us to step into every room with poise and purpose."
    ],
    tags: ["Power Dressing", "Tailoring", "Modern Uniform", "Structure", "Career Style"]
  },
  5: {
    subtitle: "Accessories are the exclamation points of fashion. A single exceptional piece can define an entire aesthetic.",
    authorInitials: "JM",
    authorName: "Julian Mercer",
    authorSub: "March 2026 - Vault Editorial",
    dropCap: "A",
    firstParagraphRemainder: "cquiring fashion is easy, but building a collection is an art. The most discerning collectors focus on investment pieces—accessories that transcend seasonal whims, retain their value, and grow more beautiful with time.",
    pullQuote: "Buy less, choose well, and make it last. The finest accessories are those that tell a story of longevity.",
    paragraphs: [
      "From structural handbags with immaculate stitching to hand-finished timepieces and sculptural gold jewelry, these pieces serve as the anchors of a versatile wardrobe. They possess a timeless quality that elevates simple ensembles, transforming a casual outfit into an editorial statement.",
      "When we invest in quality craftsmanship, we support the heritage of artisans and decrease our reliance on the fast fashion cycle. These pieces are not merely purchases; they are heirlooms in the making, designed to be worn, loved, and passed down."
    ],
    tags: ["Investment Pieces", "Luxury Accessories", "Artisanal", "Heritage", "Curated Wardrobe"]
  },
  6: {
    subtitle: "The runway may propose fashion, but the streets decide style. The world's capitals are living galleries of creative self-expression.",
    authorInitials: "CL",
    authorName: "Chloe Laurent",
    authorSub: "June 2026 - Street Scout",
    dropCap: "F",
    firstParagraphRemainder: "rom the structured minimalist layers of Copenhagen to the bold, eclectic pairings on the streets of Tokyo, global street style is a testament to the democracy of fashion. It is where trends are born, mixed, and personalized in real time.",
    pullQuote: "The street is the ultimate fashion show. It is where the abstract concepts of designers become real, lived experiences.",
    paragraphs: [
      "In Paris, we see an effortless blend of classic tailoring and relaxed streetwear. In Milan, a celebration of rich textures, vibrant colors, and dramatic outerwear. These regional nuances reflect the culture, history, and energy of each city, offering endless inspiration for our own wardrobes.",
      "By looking beyond the runways to the sidewalks of the world, we discover new ways to wear the items we already own. We learn to pair the unexpected, break traditional rules, and embrace fashion as a joyful, global conversation."
    ],
    tags: ["Street Style", "Global Fashion", "Copenhagen Style", "Tokyo Trends", "Sidewalk Runway"]
  },
  7: {
    subtitle: "Simplicity is the ultimate sophistication. Curating a wardrobe is curating a lifestyle of focus.",
    authorInitials: "LH",
    authorName: "Laura Hanes",
    authorSub: "April 2026 - Minimalist Living",
    dropCap: "M",
    firstParagraphRemainder: "indful dressing starts with the edit. By slowing down our intake and focusing on the items that bring genuine utility and aesthetic joy, we transform our relationship with our clothes.",
    pullQuote: "To curate is to care. A smaller, finer wardrobe creates space for clarity, creativity, and calm.",
    paragraphs: [
      "In modern times, we are overwhelmed by choices. Selecting a wardrobe built on slow fashion and classic, interchangeable essentials reduces decision fatigue and aligns our style with our principles of conservation and beauty.",
      "The result is a collection that is completely personal, versatile, and enduring. You don't just dress better; you live with greater intention and connection to the craftsmanship behind each garment."
    ],
    tags: ["Slow Living", "Minimalism", "Sustainable", "Wardrobe Edit", "Clarity"]
  },
  8: {
    subtitle: "When the sun sets, style becomes theatrical. Evening wear is the poetry of shadows and candlelight.",
    authorInitials: "DN",
    authorName: "Dimitri Noir",
    authorSub: "June 2026 - After-Hours Style",
    dropCap: "N",
    firstParagraphRemainder: "ighttime calls for rich textures that play with light—silk, satin, velvet, and deep midnight wools. The silhouette is elongated, the colors are deep, and the mood is effortlessly mysterious.",
    pullQuote: "True glamour is never loud. It is the sweep of a black silk hem and the confidence of a quiet presence.",
    paragraphs: [
      "Whether it is an unstructured dinner jacket, a sculptural black slip dress, or fine gold jewelry catching the dim light, evening style is about setting a tone of relaxed refinement.",
      "By stripping away excess embellishment, we focus on line and movement, creating unforgettable looks that speak of luxury and romance without trying to capture attention."
    ],
    tags: ["Evening Edit", "Glamour", "Silk & Satin", "Night Style", "Luxury"]
  },
  9: {
    subtitle: "Layering is the art of fashion collage. It is how we combine comfort and structure to face the cold with style.",
    authorInitials: "FK",
    authorName: "Fiona Kincaid",
    authorSub: "January 2026 - Alpine & Urban",
    dropCap: "W",
    firstParagraphRemainder: "inter dressing shouldn't be about hiding under heavy coats. Instead, it is an opportunity to compose multi-dimensional outfits that pair wool, cashmere, leather, and fine knits in structured layers.",
    pullQuote: "The coat is the first impression, but the layers underneath tell the complete story of your style.",
    paragraphs: [
      "A great winter look balances bulk and warmth. Start with lightweight base layers, add textural interest with mid-layers, and complete the frame with a structured wool trench or coat.",
      "By understanding proportions and varying textures, we create warmth that feels light, polished, and sophisticated, making winter our most stylish season of all."
    ],
    tags: ["Winter Style", "Layering", "Cashmere", "Outerwear", "Textural Play"]
  },
  10: {
    subtitle: "Coastal dressing is about breezy ease. It is style designed for sun-drenched paths and salt air.",
    authorInitials: "SB",
    authorName: "Sienna Bay",
    authorSub: "July 2026 - Escape Magazine",
    dropCap: "T",
    firstParagraphRemainder: "he coastal aesthetic is defined by lightweight linens, organic cottons, and relaxed silhouettes that breathe with the breeze. It is a wardrobe that transitions easily from seaside walks to outdoor dinners.",
    pullQuote: "Fashion on the coast is simple, clean, and completely relaxed. It is the uniform of leisure.",
    paragraphs: [
      "Focus on neutral, sun-bleached tones: sand, ecru, soft blue, and clean white. These colors reflect the light and harmonize beautifully with nature, creating an atmosphere of effortless luxury.",
      "By keeping accessories minimal—a straw tote, leather slides, and classic sunglasses—we celebrate the freedom of summer and the simplicity of coastal living."
    ],
    tags: ["Coastal Style", "Linen Edit", "Summer Travel", "Resort Wear", "Relaxed"]
  },
  11: {
    subtitle: "Confidence is tailored. What we wear to lead should reflect our competence, focus, and drive.",
    authorInitials: "RH",
    authorName: "Rachel Hunt",
    authorSub: "March 2026 - Leader's Journal",
    dropCap: "T",
    firstParagraphRemainder: "he corporate uniform has expanded to allow for authentic, powerful personal styling. High-quality structured blazers, fine trousers, and classic button-downs set a standard of professionalism while expressing individuality.",
    pullQuote: "Tailoring is the structure of confidence. A suit that fits perfectly is a silent partner in your success.",
    paragraphs: [
      "When we dress with authority, we project our focus and respect for our work. It is about choosing fabrics that hold their shape, clean lines, and accessories that add a polished final touch.",
      "This is workwear reimagined: not a restriction, but an asset. A versatile collection of tailored office essentials that ensures you always step into the room ready and poised."
    ],
    tags: ["Workwear", "Tailoring", "Professional", "Blazers", "Confidence"]
  },
  12: {
    subtitle: "The coat is the ultimate frame. It determines the entire outline and presence of your winter style.",
    authorInitials: "JM",
    authorName: "Julian Mercer",
    authorSub: "November 2025 - Silhouette Edit",
    dropCap: "A",
    firstParagraphRemainder: "great coat does all the work for you. On cold days, it is the only garment people see, which makes it the single most important investment in your cold-weather wardrobe.",
    pullQuote: "A beautiful coat wraps you in structure and warmth. It is the defining line of winter style.",
    paragraphs: [
      "From double-breasted wool trenches to oversized minimalist shapes, the coat defines your presence in the street. Select colors like camel, charcoal, or deep olive to ensure longevity and versatile pairing.",
      "Investing in high-quality wools and structured tailoring guarantees that your coat remains a timeless staple for seasons to come, elevating even the simplest base outfits underneath."
    ],
    tags: ["Outerwear", "Coats", "Trench", "Winter Uniform", "Investment"]
  },
  13: {
    subtitle: "In an era of relentless spectacle, the most radical act in fashion has become refusal — the refusal to announce, to embellish, to perform.",
    authorInitials: "IM",
    authorName: "Isabelle Moreau",
    authorSub: "May 2026 - Editorial Pick",
    dropCap: "M",
    firstParagraphRemainder: "inimalism is not the absence of design; it is the presence of clarity. When we strip away the noise of fast trends, we are left with the essence of form, drape, and material integrity.",
    pullQuote: "Restraint is the ultimate volume. A quiet silhouette commands attention by its sheer composure.",
    paragraphs: [
      "The architecture of silence in fashion is built on impeccable construction. A clean line requires precise tailoring, high-quality fabric, and careful engineering. There are no patterns or logos to hide imperfections.",
      "By embracing a quiet aesthetic, we make a statement of self-assurance. We declare that we do not need to shout to be seen, and that true luxury lies in the unseen details and the elegance of restraint."
    ],
    tags: ["Minimalism", "Quiet Luxury", "Editor's Choice", "Tailoring", "Architecture"]
  }
};

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const articleId = Number(id);

  const articleMeta = news.find((n) => n.id === articleId);
  const articleContent = articleContents[articleId];

  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (articleMeta) {
      document.title = `${articleMeta.headline} — StyleAI`;
    }

    // Read saved status
    const saved = localStorage.getItem("styleai_saved_articles");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setIsSaved(parsed.includes(articleId));
      } catch (e) {
        console.error(e);
      }
    }

    // Read liked status
    const liked = localStorage.getItem("styleai_liked_articles");
    if (liked) {
      try {
        const parsed = JSON.parse(liked);
        setIsLiked(parsed.includes(articleId));
      } catch (e) {
        console.error(e);
      }
    }
  }, [articleId, articleMeta]);

  if (!articleMeta || !articleContent) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col">
        <TopNav />
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <h2 className="text-2xl font-serif mb-4">Article Not Found</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 rounded-full border border-white/20 text-sm hover:bg-white/10 transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const toggleSave = () => {
    const saved = localStorage.getItem("styleai_saved_articles");
    let next: number[] = [];
    if (saved) {
      try {
        next = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    if (next.includes(articleId)) {
      next = next.filter((item) => item !== articleId);
      setIsSaved(false);
      toast.success("Removed from bookmarks");
    } else {
      next.push(articleId);
      setIsSaved(true);
      toast.success("Added to bookmarks");
    }
    localStorage.setItem("styleai_saved_articles", JSON.stringify(next));
  };

  const toggleLike = () => {
    const liked = localStorage.getItem("styleai_liked_articles");
    let next: number[] = [];
    if (liked) {
      try {
        next = JSON.parse(liked);
      } catch (e) {
        console.error(e);
      }
    }
    if (next.includes(articleId)) {
      next = next.filter((item) => item !== articleId);
      setIsLiked(false);
      toast.success("Removed from favorites");
    } else {
      next.push(articleId);
      setIsLiked(true);
      toast.success("Added to favorites");
    }
    localStorage.setItem("styleai_liked_articles", JSON.stringify(next));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* TopNav is fixed/sticky normally on header, but let's hide or show it elegantly.
          We can show it on the top of the detail page if the user scrolls, but let's render it on mobile,
          and on desktop we can keep the header navigation flow clean by retaining it. */}
      <TopNav />

      {/* Main split-screen container */}
      <div className="flex-grow flex flex-col md:flex-row relative">
        
        {/* Left Column: Sticky Image */}
        <div className="w-full md:w-1/2 md:h-[calc(100vh-64px)] md:sticky md:top-16 overflow-hidden relative aspect-[4/3] md:aspect-auto">
          <div className="w-full h-full animate-slide-in-left relative">
            <img
              src={articleMeta.img}
              alt={articleMeta.headline}
              className="w-full h-full object-cover select-none"
            />
            {/* Subtle gradient overlay at bottom for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

            {/* Screenshot Special Effect: Geometric patterns in top left */}
            <div className="absolute top-8 left-8 flex items-center gap-3 pointer-events-none opacity-80">
              <span className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full animate-pulse" />
              <span className="w-8 h-8 rounded-full border border-[#D4AF37]/50" />
            </div>

            {/* Category/Title overlay at the bottom left */}
            <div className="absolute bottom-8 left-8 right-8 z-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                {articleMeta.tag}
              </p>
              <h2 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white/95 leading-tight tracking-wide drop-shadow-lg">
                {articleMeta.headline}
              </h2>
            </div>
          </div>
        </div>

        {/* Right Column: Scrollable text content */}
        <div className="w-full md:w-1/2 bg-[#050505] flex flex-col min-h-full">
          <div className="flex-grow px-6 sm:px-12 lg:px-20 py-12 md:py-16 max-w-2xl mx-auto md:mx-0 w-full">
            
            {/* Top row actions */}
            <div className="flex items-center justify-between gap-4 animate-fade-in-up delay-1200">
              <button
                onClick={() => navigate("/dashboard")}
                className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/60 hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                Back to Editorial
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleShare}
                  title="Share Link"
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/15 hover:border-white/30 transition-all duration-300 group cursor-pointer"
                >
                  <Share2 className="h-4 w-4 text-white/70 group-hover:text-[#D4AF37] transition-colors" />
                </button>
                <button
                  onClick={toggleSave}
                  title="Bookmark Article"
                  className={cn(
                    "w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer",
                    isSaved
                      ? "border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37]"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:border-white/30"
                  )}
                >
                  <Bookmark className={cn("h-4 w-4 transition-all", isSaved && "fill-[#D4AF37]")} />
                </button>
                <button
                  onClick={toggleLike}
                  title="Favorite Article"
                  className={cn(
                    "w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer",
                    isLiked
                      ? "border-rose-500/50 bg-rose-500/10 text-rose-500"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:border-white/30"
                  )}
                >
                  <Heart className={cn("h-4 w-4 transition-all", isLiked && "fill-rose-500 text-rose-500")} />
                </button>
              </div>
            </div>

            {/* Pill badge */}
            <div className="mt-12 animate-fade-in-up delay-1300">
              <span className={cn(
                "inline-block rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-semibold",
                articleMeta.colorClass.split(" ").slice(0, 2).join(" ")
              )}>
                {articleMeta.tag}
              </span>
            </div>

            {/* Large editorial headline */}
            <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-white/95 leading-[1.15] mt-6 tracking-wide animate-fade-in-up delay-1400">
              {articleMeta.headline}
            </h1>

            {/* Subtitle quote block */}
            <p className="font-editorial-serif text-lg sm:text-xl font-light italic text-white/50 leading-relaxed mt-6 pl-4 border-l border-white/10 animate-fade-in-up delay-1500">
              "{articleContent.subtitle}"
            </p>

            {/* Author details block */}
            <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 animate-fade-in-up delay-1600">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 flex items-center justify-center font-editorial-serif text-sm tracking-widest text-[#D4AF37] font-semibold select-none">
                  {articleContent.authorInitials}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white/90">{articleContent.authorName}</h4>
                  <p className="text-xs text-white/40 mt-0.5">{articleContent.authorSub}</p>
                </div>
              </div>
              <span className="border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-bold tracking-[0.2em] text-white/40 bg-[#0c0c0e]">
                {articleMeta.readTime.toUpperCase()}
              </span>
            </div>

            {/* Elegant Diamond sparkle separator */}
            <div className="my-12 flex items-center justify-center gap-5 animate-fade-in-up delay-1700">
              <div className="h-[1px] bg-gradient-to-r from-transparent to-white/10 flex-grow" />
              <Sparkles className="h-4.5 w-4.5 text-[#D4AF37] animate-pulse" />
              <div className="h-[1px] bg-gradient-to-l from-transparent to-white/10 flex-grow" />
            </div>

            {/* Article Body Content */}
            <div className="font-editorial-serif text-base sm:text-lg lg:text-xl font-light text-white/70 leading-relaxed tracking-wide space-y-6 animate-fade-in-up delay-1800">
              
              {/* Drop Cap styling on the first paragraph */}
              <p className="relative">
                <span className="float-left text-7xl sm:text-8xl pr-3 pt-1 text-[#D4AF37] font-editorial-serif font-normal leading-[0.8] mt-1.5 select-none">
                  {articleContent.dropCap}
                </span>
                {articleContent.firstParagraphRemainder}
              </p>

              {/* Styled Pull-quote */}
              <blockquote className="border-l-2 border-[#D4AF37] pl-6 py-1 my-10 font-editorial-serif text-xl sm:text-2xl font-light italic text-[#D4AF37] leading-relaxed">
                "{articleContent.pullQuote}"
              </blockquote>

              {/* Remaining paragraphs */}
              {articleContent.paragraphs.map((p, index) => (
                <p key={index}>{p}</p>
              ))}

            </div>

            {/* Bottom tags list */}
            <div className="mt-16 pt-8 border-t border-white/10 animate-fade-in-up delay-1900">
              <div className="flex flex-wrap gap-2.5">
                {articleContent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-white/10 px-4 py-2 rounded-full text-[9px] font-semibold tracking-[0.15em] text-white/50 bg-[#0c0c0e] uppercase transition-all duration-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 hover:bg-[#121215]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ArticleDetail;