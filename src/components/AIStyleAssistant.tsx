import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ImagePlus, Send, Sparkles, ExternalLink, Loader2, Star } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { visualSearch, styleChat, rateStyle, type SimilarItem, type ChatMsg } from "@/lib/api";
import { useWeather } from "@/components/WeatherWidget";
import { toast } from "sonner";
const renderMarkdown = (text: string) => {
  const html = text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^\s*[-*]\s+(.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    .replace(/\n/g, "<br/>");
  return html;
};

type Message =
  | { id: string; role: "user"; kind: "text"; text: string }
  | { id: string; role: "user"; kind: "image"; src: string }
  | { id: string; role: "bot"; kind: "text"; text: string }
  | { id: string; role: "bot"; kind: "results"; items: SimilarItem[] }
  | { id: string; role: "bot"; kind: "rating"; score: number; aesthetic: string[]; advice: string[] };

const uid = () => Math.random().toString(36).slice(2);

// Mock closet — kept in sync with /closet page until persisted
const CLOSET = [
  { name: "Silk Slip Dress", category: "Dresses", tags: ["Party", "Summer"] },
  { name: "Wool Trench", category: "Outerwear", tags: ["Formal", "Winter"] },
  { name: "Cashmere Knit", category: "Knitwear", tags: ["Casual", "Winter"] },
  { name: "Tailored Trouser", category: "Bottoms", tags: ["Formal"] },
  { name: "Leather Loafer", category: "Footwear", tags: ["Casual", "Formal"] },
  { name: "Linen Shirt", category: "Tops", tags: ["Casual", "Summer"] },
  { name: "Performance Tee", category: "Tops", tags: ["Workout", "Summer"] },
  { name: "Quilted Coat", category: "Outerwear", tags: ["Winter"] },
];

export const AIStyleAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(),
      role: "bot",
      kind: "text",
      text: "Namaste! 👋 I'm your AI Stylist. Ask me what to wear (casual, party, office, date, festival), upload a clothing photo to find it on Myntra/Amazon/Shein/Ajio, or say **rate me** to get a style score.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastFace, setLastFace] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const faceRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user } = useAuth();
  const { weather } = useWeather();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, loading]);

  if (!user || ["/auth", "/"].includes(location.pathname)) return null;

  const locationCtx = weather
    ? { city: weather.city, region: weather.region, country: weather.country }
    : null;

  const sendText = async () => {
    const q = input.trim();
    if (!q) return;
    setInput("");
    setMessages((m) => [...m, { id: uid(), role: "user", kind: "text", text: q }]);

    // shortcut: rate me
    if (/\brate\b|\bscore\b|\brating\b/i.test(q)) {
      setLoading(true);
      try {
        const r = await rateStyle({ facePhoto: lastFace, closet: CLOSET });
        setMessages((m) => [...m, { id: uid(), role: "bot", kind: "rating", score: r.score, aesthetic: r.aesthetic, advice: r.advice }]);
      } catch (e: any) {
        toast.error(e.message || "Rating failed");
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const history: ChatMsg[] = messages
        .filter((m) => m.kind === "text")
        .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: (m as any).text }));
      history.push({ role: "user", content: q });
      const { reply } = await styleChat({ messages: history, weather, closet: CLOSET, location: locationCtx });
      setMessages((m) => [...m, { id: uid(), role: "bot", kind: "text", text: reply || "—" }]);
    } catch (e: any) {
      toast.error(e.message || "Chat failed");
    } finally {
      setLoading(false);
    }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const src = reader.result as string;
      setMessages((m) => [...m, { id: uid(), role: "user", kind: "image", src }]);
      setLoading(true);
      try {
        const res = await visualSearch(src);
        setMessages((m) => [
          ...m,
          { id: uid(), role: "bot", kind: "text", text: res.description || "Found similar pieces on Myntra, Amazon, Shein and Ajio:" },
          { id: uid(), role: "bot", kind: "results", items: res.items || [] },
        ]);
      } catch (err: any) {
        toast.error(err.message || "Visual search failed");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const onFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setLastFace(src);
      setMessages((m) => [
        ...m,
        { id: uid(), role: "user", kind: "image", src },
        { id: uid(), role: "bot", kind: "text", text: "Got your photo. Type **rate me** to get your style score." },
      ]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open AI Style Assistant"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-primary text-white shadow-glow hover:scale-105 transition-transform flex items-center justify-center"
      >
        <Sparkles className="h-6 w-6" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-card border-border">
          <SheetHeader className="px-6 py-5 border-b border-border">
            <SheetDescription className="text-xs uppercase tracking-widest text-primary font-semibold">
              {weather ? `${weather.city}${weather.country ? ", " + weather.country : ""} · ${weather.tempC}° ${weather.condition}` : "Concierge"}
            </SheetDescription>
            <SheetTitle className="text-2xl font-bold">AI Style Assistant</SheetTitle>
          </SheetHeader>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-3">
            {messages.map((m) => {
              if (m.kind === "text") {
                return (
                  <div key={m.id} className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                    m.role === "user" ? "ml-auto bg-gradient-primary text-white" : "bg-secondary/70 text-foreground"
                  }`}>
                    {m.role === "bot" ? (
                      <div className="[&_ul]:list-disc [&_ul]:pl-4 [&_strong]:font-semibold" dangerouslySetInnerHTML={{ __html: renderMarkdown(m.text) }} />
                    ) : m.text}
                  </div>
                );
              }
              if (m.kind === "image") {
                return (
                  <div key={m.id} className="ml-auto max-w-[70%]">
                    <img src={m.src} alt="upload" className="rounded-2xl border border-border" />
                  </div>
                );
              }
              if (m.kind === "rating") {
                return (
                  <div key={m.id} className="rounded-2xl border border-border bg-secondary/60 p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-white font-bold text-lg">
                        {m.score}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Style Score</p>
                        <p className="font-semibold">{m.aesthetic.join(" · ")}</p>
                      </div>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-sm text-foreground/90">
                      {m.advice.map((a, i) => (
                        <li key={i} className="flex gap-2"><Star className="h-3 w-3 mt-1 text-primary shrink-0" />{a}</li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return (
                <div key={m.id} className="grid grid-cols-2 gap-3">
                  {m.items.map((it) => (
                    <div key={it.id} className="rounded-2xl border border-border bg-secondary/50 overflow-hidden">
                      <div className="aspect-square bg-secondary overflow-hidden">
                        {it.thumb && <img src={it.thumb} alt={it.title} className="h-full w-full object-cover" loading="lazy" />}
                      </div>
                      <div className="p-3">
                        {it.retailer && <p className="text-[9px] uppercase tracking-widest text-primary font-bold">{it.retailer}</p>}
                        <p className="text-xs font-semibold leading-tight line-clamp-2 mt-0.5">{it.title}</p>
                        <p className="text-xs text-gradient font-bold mt-1">{it.price}</p>
                        <a href={it.url} target="_blank" rel="noopener noreferrer"
                          className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-gradient-primary text-white text-[10px] font-semibold py-1.5 hover:opacity-90">
                          Buy Now <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
              </div>
            )}
          </div>

          <div className="border-t border-border p-4 space-y-2">
            <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
            <input ref={faceRef} type="file" accept="image/*" onChange={onFaceUpload} className="hidden" />
            <div className="flex gap-2">
              <Button onClick={() => fileRef.current?.click()} variant="outline" size="sm" className="flex-1 rounded-xl bg-secondary/40">
                <ImagePlus className="mr-1.5 h-3.5 w-3.5" /> Find Item
              </Button>
              <Button onClick={() => faceRef.current?.click()} variant="outline" size="sm" className="flex-1 rounded-xl bg-secondary/40">
                <Star className="mr-1.5 h-3.5 w-3.5" /> Rate Me
              </Button>
            </div>
            <div className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && sendText()}
                placeholder="What should I wear to a party?"
                className="rounded-xl bg-secondary/60" />
              <Button onClick={sendText} disabled={loading} className="rounded-xl bg-gradient-primary text-white px-3">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
