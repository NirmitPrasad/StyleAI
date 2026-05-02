import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ImagePlus, Send, Sparkles, ExternalLink, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type SimilarItem = { id: string; title: string; price: string; thumb: string; url: string };

type Message =
  | { id: string; role: "user"; kind: "text"; text: string }
  | { id: string; role: "user"; kind: "image"; src: string }
  | { id: string; role: "bot"; kind: "text"; text: string }
  | { id: string; role: "bot"; kind: "results"; items: SimilarItem[] };

async function postVisualSearch(_file: File | string): Promise<SimilarItem[]> {
  // TODO: wire up to FastAPI: POST /api/visual-search
  // const fd = new FormData();
  // fd.append("image", file);
  // const res = await fetch("/api/visual-search", { method: "POST", body: fd });
  // return (await res.json()).items;
  await new Promise((r) => setTimeout(r, 1500));
  return [
    { id: "1", title: "Bias-Cut Slip Dress", price: "$248", thumb: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300", url: "#" },
    { id: "2", title: "Satin Midi Dress", price: "$189", thumb: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300", url: "#" },
    { id: "3", title: "Silk Cami Gown", price: "$420", thumb: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300", url: "#" },
    { id: "4", title: "Minimalist Slip", price: "$156", thumb: "https://images.unsplash.com/photo-1485518882345-15568b007407?w=300", url: "#" },
  ];
}

const uid = () => Math.random().toString(36).slice(2);

export const AIStyleAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: uid(), role: "bot", kind: "text", text: "Hello — I'm your AI Style Assistant. Upload a photo of a dress or describe what you're looking for." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  if (!user || location.pathname === "/auth" || location.pathname === "/") return null;

  const sendText = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { id: uid(), role: "user", kind: "text", text: input }]);
    const q = input;
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: uid(), role: "bot", kind: "text", text: `Thinking about "${q}"… try uploading an image for visual search.` },
      ]);
      setLoading(false);
    }, 800);
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const src = reader.result as string;
      setMessages((m) => [...m, { id: uid(), role: "user", kind: "image", src }]);
      setLoading(true);
      const items = await postVisualSearch(file);
      setMessages((m) => [
        ...m,
        { id: uid(), role: "bot", kind: "text", text: "Found similar pieces in your style:" },
        { id: uid(), role: "bot", kind: "results", items },
      ]);
      setLoading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open AI Style Assistant"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-foreground text-background shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        <Sparkles className="h-6 w-6" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0 flex flex-col rounded-none border-border"
        >
          <SheetHeader className="px-6 py-5 border-b border-border">
            <SheetDescription className="text-[10px] uppercase tracking-editorial text-muted-foreground">
              Concierge
            </SheetDescription>
            <SheetTitle className="font-serif text-2xl">AI Style Assistant</SheetTitle>
          </SheetHeader>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
            {messages.map((m) => {
              if (m.kind === "text") {
                return (
                  <div
                    key={m.id}
                    className={`max-w-[85%] px-4 py-3 text-sm ${
                      m.role === "user"
                        ? "ml-auto bg-foreground text-background"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {m.text}
                  </div>
                );
              }
              if (m.kind === "image") {
                return (
                  <div key={m.id} className="ml-auto max-w-[70%]">
                    <img src={m.src} alt="upload" className="border border-border" />
                  </div>
                );
              }
              // results grid
              return (
                <div key={m.id} className="grid grid-cols-2 gap-3">
                  {m.items.map((it) => (
                    <div key={it.id} className="border border-border bg-card">
                      <div className="aspect-square bg-secondary overflow-hidden">
                        <img src={it.thumb} alt={it.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-serif leading-tight">{it.title}</p>
                        <p className="text-[10px] uppercase tracking-editorial text-muted-foreground mt-1">{it.price}</p>
                        <a
                          href={it.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center justify-center gap-1 border border-foreground text-[10px] uppercase tracking-editorial py-1.5 hover:bg-foreground hover:text-background transition-colors"
                        >
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
                <Loader2 className="h-3 w-3 animate-spin" /> Searching…
              </div>
            )}
          </div>

          <div className="border-t border-border p-4 space-y-3">
            <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
            <Button
              onClick={() => fileRef.current?.click()}
              variant="outline"
              className="w-full h-11 rounded-none text-xs uppercase tracking-editorial"
            >
              <ImagePlus className="mr-2 h-4 w-4" /> Upload Photo of a Dress
            </Button>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendText()}
                placeholder="Ask anything about style…"
                className="h-11 rounded-none focus-visible:ring-0"
              />
              <Button onClick={sendText} className="h-11 w-11 rounded-none p-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
