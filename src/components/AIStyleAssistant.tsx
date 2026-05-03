import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ImagePlus, Send, Sparkles, ExternalLink, Loader2, Star, X, ShoppingBag } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { visualSearch, styleChat, rateStyle, type SimilarItem, type ChatMsg } from "@/lib/api";
import { useWeather } from "@/components/WeatherWidget";
import { renderMarkdownSafe } from "@/lib/sanitize";
import { toast } from "sonner";

type Message =
  | { id: string; role: "user"; kind: "text"; text: string; image?: string }
  | { id: string; role: "user"; kind: "image"; src: string }
  | { id: string; role: "bot"; kind: "text"; text: string }
  | { id: string; role: "bot"; kind: "results"; items: SimilarItem[] }
  | { id: string; role: "bot"; kind: "rating"; score: number; aesthetic: string[]; advice: string[] };

const uid = () => Math.random().toString(36).slice(2);

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

const QUICK_PROMPTS = [
  "What should I wear to a party tonight?",
  "Casual brunch outfit?",
  "Office look for tomorrow",
  "Festival / wedding ideas",
];

export const AIStyleAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(),
      role: "bot",
      kind: "text",
      text: "Namaste! 👋 I'm your AI Stylist. Ask me what to wear, attach a photo with your question, or tap **Find Item** to shop the look on Myntra, Amazon, Shein & Ajio.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
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

  const sendText = async (override?: string) => {
    const q = (override ?? input).trim();
    const img = pendingImage;
    if (!q && !img) return;
    setInput("");
    setPendingImage(null);
    setMessages((m) => [...m, { id: uid(), role: "user", kind: "text", text: q || "(image)", image: img || undefined }]);

    if (/\brate\s*me\b|\bstyle\s*score\b/i.test(q)) {
      setLoading(true);
      try {
        const r = await rateStyle({ facePhoto: lastFace || img, closet: CLOSET });
        setMessages((m) => [...m, { id: uid(), role: "bot", kind: "rating", score: r.score, aesthetic: r.aesthetic, advice: r.advice }]);
      } catch (e: any) {
        toast.error(e.message || "Rating failed");
      } finally { setLoading(false); }
      return;
    }

    setLoading(true);
    try {
      const history: ChatMsg[] = messages
        .filter((m) => m.kind === "text")
        .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: (m as any).text }));

      const userContent: ChatMsg["content"] = img
        ? [
            { type: "text", text: q || "What is this and how should I style it?" },
            { type: "image_url", image_url: { url: img } },
          ]
        : q;
      history.push({ role: "user", content: userContent });

      const { reply } = await styleChat({ messages: history, weather, closet: CLOSET, location: locationCtx });
      setMessages((m) => [...m, { id: uid(), role: "bot", kind: "text", text: reply || "—" }]);
    } catch (e: any) {
      toast.error(e.message || "Chat failed");
    } finally { setLoading(false); }
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const findSimilar = async () => {
    if (!pendingImage) { toast.info("Attach a photo first"); return; }
    const src = pendingImage;
    setPendingImage(null);
    setMessages((m) => [...m, { id: uid(), role: "user", kind: "image", src }]);
    setLoading(true);
    try {
      const res = await visualSearch(src);
      setMessages((m) => [
        ...m,
        { id: uid(), role: "bot", kind: "text", text: res.description || "Shop the look:" },
        { id: uid(), role: "bot", kind: "results", items: res.items || [] },
      ]);
    } catch (err: any) {
      toast.error(err.message || "Visual search failed");
    } finally { setLoading(false); }
  };

  const onFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const src = reader.result as string;
      setLastFace(src);
      setMessages((m) => [...m, { id: uid(), role: "user", kind: "image", src }]);
      setLoading(true);
      try {
        const r = await rateStyle({ facePhoto: src, closet: CLOSET });
        setMessages((m) => [...m, { id: uid(), role: "bot", kind: "rating", score: r.score, aesthetic: r.aesthetic, advice: r.advice }]);
      } catch (e: any) {
        toast.error(e.message || "Rating failed");
      } finally { setLoading(false); }
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
          <SheetHeader className="px-6 py-4 border-b border-border">
            <SheetDescription className="text-[10px] uppercase tracking-widest text-primary font-semibold">
              {weather ? `${weather.city}${weather.country ? ", " + weather.country : ""} · ${weather.tempC}° ${weather.condition}` : "Concierge"}
            </SheetDescription>
            <SheetTitle className="text-xl font-bold">AI Style Assistant</SheetTitle>
          </SheetHeader>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m) => {
              if (m.kind === "text") {
                return (
                  <div key={m.id} className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user" ? "ml-auto bg-gradient-primary text-white" : "bg-secondary/70 text-foreground"
                  }`}>
                    {(m as any).image && (
                      <img src={(m as any).image} alt="" className="rounded-xl mb-2 max-h-48 object-cover" />
                    )}
                    {m.role === "bot"
                      ? <div className="[&_a]:underline [&_strong]:font-semibold [&_ul]:mt-1" dangerouslySetInnerHTML={{ __html: renderMarkdownSafe(m.text) }} />
                      : <span>{m.text}</span>}
                  </div>
                );
              }
              if (m.kind === "image") {
                return (
                  <div key={m.id} className="ml-auto max-w-[60%]">
                    <img src={m.src} alt="upload" className="rounded-2xl border border-border" />
                  </div>
                );
              }
              if (m.kind === "rating") {
                return (
                  <div key={m.id} className="rounded-2xl border border-border bg-secondary/60 p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-white font-bold text-lg">{m.score}</div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Style Score</p>
                        <p className="font-semibold text-sm">{m.aesthetic.join(" · ")}</p>
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
                <div key={m.id} className="grid grid-cols-2 gap-2">
                  {m.items.map((it) => (
                    <div key={it.id} className="rounded-2xl border border-border bg-secondary/50 overflow-hidden">
                      <div className="aspect-square bg-secondary overflow-hidden">
                        {it.thumb && <img src={it.thumb} alt={it.title} className="h-full w-full object-cover" loading="lazy" />}
                      </div>
                      <div className="p-2.5">
                        {it.retailer && <p className="text-[9px] uppercase tracking-widest text-primary font-bold">{it.retailer}</p>}
                        <p className="text-xs font-semibold leading-tight line-clamp-2 mt-0.5">{it.title}</p>
                        <p className="text-xs text-gradient font-bold mt-1">{it.price}</p>
                        <a href={it.url} target="_blank" rel="noopener noreferrer"
                          className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-gradient-primary text-white text-[10px] font-semibold py-1.5 hover:opacity-90">
                          Buy <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs px-2">
                <Loader2 className="h-3 w-3 animate-spin" /> Styling…
              </div>
            )}
          </div>

          <div className="border-t border-border p-3 space-y-2">
            {/* Quick prompts */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((p) => (
                  <button key={p} onClick={() => sendText(p)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-secondary/40 hover:bg-secondary text-foreground/80">
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Pending image preview */}
            {pendingImage && (
              <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/40 p-2">
                <img src={pendingImage} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <div className="flex-1 text-xs text-muted-foreground">Image ready. Type a question or shop similar.</div>
                <Button size="sm" variant="ghost" onClick={findSimilar} className="h-8 px-2">
                  <ShoppingBag className="h-3.5 w-3.5 mr-1" /> Shop
                </Button>
                <button onClick={() => setPendingImage(null)} aria-label="Remove" className="text-muted-foreground hover:text-foreground p-1">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
            <input ref={faceRef} type="file" accept="image/*" onChange={onFaceUpload} className="hidden" />
            <div className="flex items-center gap-2">
              <button onClick={() => fileRef.current?.click()} aria-label="Attach image"
                className="h-10 w-10 grid place-items-center rounded-xl bg-secondary/50 hover:bg-secondary text-foreground border border-border">
                <ImagePlus className="h-4 w-4" />
              </button>
              <button onClick={() => faceRef.current?.click()} aria-label="Rate my style"
                className="h-10 w-10 grid place-items-center rounded-xl bg-secondary/50 hover:bg-secondary text-foreground border border-border">
                <Star className="h-4 w-4" />
              </button>
              <Input value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && sendText()}
                placeholder={pendingImage ? "Ask about this photo…" : "What should I wear today?"}
                className="rounded-xl bg-secondary/60 h-10" />
              <Button onClick={() => sendText()} disabled={loading} className="rounded-xl bg-gradient-primary text-white h-10 px-3">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
