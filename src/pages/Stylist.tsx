import { useEffect, useRef, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, Send, Sparkles, ExternalLink, Loader2, Search } from "lucide-react";
import { visualSearch, type SimilarItem } from "@/lib/api";
import { toast } from "sonner";

type Msg =
  | { id: string; role: "user"; kind: "text"; text: string }
  | { id: string; role: "user"; kind: "image"; src: string }
  | { id: string; role: "bot"; kind: "text"; text: string }
  | { id: string; role: "bot"; kind: "results"; items: SimilarItem[] };

const uid = () => Math.random().toString(36).slice(2);

const Stylist = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { id: uid(), role: "bot", kind: "text", text: "Hello! Upload a photo of a clothing item and I'll find similar products and help you style it." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.title = "AI Stylist — StyleAI"; }, []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendText = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { id: uid(), role: "user", kind: "text", text: input }]);
    const q = input;
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { id: uid(), role: "bot", kind: "text", text: `For "${q}", upload a photo so I can run a visual search.` }]);
    }, 400);
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setPreview(src);
      setMessages((m) => [...m, { id: uid(), role: "user", kind: "image", src }]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const findSimilar = async () => {
    if (!preview) {
      toast.error("Upload a clothing photo first");
      return;
    }
    setLoading(true);
    try {
      const res = await visualSearch(preview);
      setMessages((m) => [
        ...m,
        { id: uid(), role: "bot", kind: "text", text: res.description || "Found similar pieces:" },
        { id: uid(), role: "bot", kind: "results", items: res.items || [] },
      ]);
    } catch (e: any) {
      toast.error(e.message || "Visual search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <div className="flex-1 mx-auto w-full max-w-7xl px-5 sm:px-8 py-6 grid lg:grid-cols-2 gap-6">
        {/* Chat */}
        <section className="flex flex-col rounded-3xl border border-border bg-card/60 backdrop-blur min-h-[500px]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map((m) => {
              if (m.kind === "text") {
                return (
                  <div key={m.id} className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                    m.role === "user"
                      ? "ml-auto bg-gradient-primary text-white"
                      : "bg-secondary/70 text-foreground"
                  }`}>
                    {m.text}
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
              return (
                <div key={m.id} className="grid grid-cols-2 gap-3">
                  {m.items.map((it) => (
                    <div key={it.id} className="rounded-2xl border border-border bg-secondary/50 overflow-hidden">
                      <div className="aspect-square bg-secondary overflow-hidden">
                        {it.thumb && <img src={it.thumb} alt={it.title} className="h-full w-full object-cover" />}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold leading-tight line-clamp-2">{it.title}</p>
                        <p className="text-xs text-gradient font-bold mt-1">{it.price}</p>
                        <a href={it.url} target="_blank" rel="noopener noreferrer"
                          className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-gradient-primary text-white text-xs font-semibold py-2 hover:opacity-90">
                          Buy Now <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> Searching…
              </div>
            )}
          </div>

          <div className="border-t border-border p-3 space-y-2">
            <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
            <Button onClick={() => fileRef.current?.click()} variant="outline" className="w-full rounded-xl bg-secondary/40">
              <ImagePlus className="mr-2 h-4 w-4" /> Upload Clothing Photo
            </Button>
            <Button onClick={findSimilar} disabled={loading || !preview}
              className="w-full rounded-xl bg-gradient-primary text-white shadow-glow hover:opacity-90">
              <Search className="mr-2 h-4 w-4" /> Find Similar Products
            </Button>
            <div className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendText()}
                placeholder="Ask anything about style…"
                className="rounded-xl bg-secondary/60" />
              <Button onClick={sendText} className="rounded-xl bg-gradient-primary text-white px-3">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Preview */}
        <section className="rounded-3xl border border-border bg-card/40 backdrop-blur p-6 flex items-center justify-center min-h-[500px]">
          {preview ? (
            <img src={preview} alt="preview" className="max-h-[500px] rounded-2xl border border-border" />
          ) : (
            <div className="text-center text-muted-foreground">
              <Sparkles className="h-10 w-10 mx-auto text-primary/60" />
              <p className="mt-3 italic">Upload a photo to get started</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Stylist;
