import { useEffect, useRef, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Send, Sparkles, ExternalLink, Loader2, Search, ArrowUpRight, X } from "lucide-react";
import { visualSearch, styleChat, type SimilarItem, type ChatMsg } from "@/lib/api";
import { toast } from "sonner";

type Msg =
  | { id: string; role: "user"; kind: "text"; text: string }
  | { id: string; role: "user"; kind: "image"; src: string }
  | { id: string; role: "bot"; kind: "text"; text: string }
  | { id: string; role: "bot"; kind: "results"; items: SimilarItem[] };

const uid = () => Math.random().toString(36).slice(2);

const actionDescriptions: Record<string, string> = {
  "Style This Item": "Discover your next favorite look. Upload a fashion piece to explore curated alternatives, styling inspiration, and personalized outfit recommendations.",
  "Discover Similar": "Find pieces that match your vibe. Upload an item and let AI locate similar styles, colors, and textures from top brands.",
  "Complete Outfit": "Don't know what to wear with it? Upload a single piece and get complete, head-to-toe outfit recommendations tailored to your style.",
  "Occasion Styling": "Dress perfectly for any event. Select an occasion and get curated looks that ensure you're always the best dressed in the room.",
  "Seasonal Picks": "Stay ahead of the trends. Discover the latest seasonal must-haves and effortlessly transition your wardrobe year-round.",
  
  "Curate My Look": "Let AI be your personal shopper. We'll build a personalized lookbook based on your unique aesthetic and color preferences.",
  "Generate Styling Ideas": "Stuck in a style rut? Get fresh, creative ways to mix and match your current wardrobe staples with new statement pieces.",
  "Complete the Outfit": "Missing the perfect pair of shoes or jacket? Upload your base layer and we'll complete the look with the perfect finishing touches.",
  "Shop the Style": "Ready to buy? Upload an inspiration photo and we'll find exact matches and budget-friendly alternatives you can shop right now."
};

const Stylist = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState("Style This Item");
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.title = "AI Stylist — StyleAI"; }, []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendText = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages((m) => [...m, { id: uid(), role: "user", kind: "text", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const chatHistory: ChatMsg[] = [];
      
      // If there's an image uploaded, provide it as context first
      if (preview) {
        chatHistory.push({
          role: "user",
          content: [
            { type: "text", text: "I am looking at this fashion item:" },
            { type: "image_url", image_url: { url: preview } }
          ]
        });
      }
      
      // Append past text conversation
      messages.forEach(m => {
        if (m.kind === "text") {
          chatHistory.push({ role: m.role === "user" ? "user" : "assistant", content: m.text });
        }
      });
      
      // Append new message
      chatHistory.push({ role: "user", content: userText });

      const res = await styleChat({
        messages: chatHistory,
        weather: null,
        closet: [],
        location: null
      });

      setMessages((m) => [...m, { id: uid(), role: "bot", kind: "text", text: res.reply }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to get styling advice");
      setMessages((m) => [...m, { id: uid(), role: "bot", kind: "text", text: "Sorry, I'm having trouble analyzing that right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setPreview(src);
      // We don't add the image to chat messages in this new layout, 
      // because it stays persistent in the right column preview area.
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
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Visual search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <TopNav />
      <main className="flex-1 mx-auto w-full max-w-[1400px] px-5 sm:px-8 py-8 grid lg:grid-cols-2 gap-10 lg:gap-16">
        
        {/* LEFT COLUMN: Input & Actions */}
        <div className="flex flex-col gap-6">
          {/* Top Info Box */}
          <div className="rounded-[24px] bg-[#0c0c0e] border border-white/5 p-6 sm:p-8 transition-all duration-300">
            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-3 w-3" /> YOUR AI STYLIST
            </p>
            <p className="font-serif italic text-lg sm:text-xl text-white/80 leading-relaxed transition-all duration-300">
              {actionDescriptions[activeAction] || actionDescriptions["Style This Item"]}
            </p>
          </div>

          {/* Action Pills */}
          <div className="flex flex-wrap gap-3 mt-2">
            {["Style This Item", "Discover Similar", "Complete Outfit", "Occasion Styling", "Seasonal Picks"].map((tag) => {
              const isActive = activeAction === tag;
              return (
                <button 
                  key={tag} 
                  onClick={() => setActiveAction(tag)}
                  className={`rounded-full border px-4 py-2 text-[11px] font-medium transition-colors ${
                    isActive 
                      ? "border-[#D4AF37]/50 text-[#D4AF37] bg-[#D4AF37]/10" 
                      : "border-white/10 text-white/50 hover:text-white/80 hover:border-white/20"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* Upload Box */}
          <div 
            className="rounded-[24px] border border-dashed border-white/10 bg-[#0c0c0e] p-6 mt-2 hover:bg-[#121215] transition-colors cursor-pointer" 
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
            <div className="flex items-center gap-5">
              <div className="h-12 w-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                <Upload className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-semibold text-white/90 text-sm">Upload Style Image</h3>
                <p className="text-[11px] text-white/40 mt-1">Drag & drop or browse • JPG, PNG, WEBP • Best with clear product images</p>
              </div>
            </div>
          </div>

          {/* Primary Button */}
          <Button 
            onClick={findSimilar} 
            disabled={loading || !preview} 
            className="w-full h-14 mt-2 rounded-2xl bg-[#D4AF37] text-black text-xs font-bold tracking-widest hover:opacity-90 shadow-lg shadow-[#D4AF37]/20"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            DISCOVER SIMILAR STYLES
          </Button>

          {/* Chat Input */}
          <div className="relative mt-auto pt-6">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && sendText()}
              placeholder="Ask about styling, outfit ideas, colors, occasions, or wardrobe pairings..." 
              className="w-full h-14 rounded-2xl bg-[#0c0c0e] border-white/5 pl-5 pr-14 text-xs italic placeholder:text-white/30 focus-visible:ring-[#D4AF37]/30" 
            />
            <Button 
              onClick={sendText} 
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-[#D4AF37] hover:bg-[#D4AF37]/80 p-0 flex items-center justify-center"
            >
              <ArrowUpRight className="h-5 w-5 text-black" />
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: Preview & Results */}
        <div className="flex flex-col h-full border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-12 relative">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-10">
            <h2 className="font-serif text-xl text-white/90">Style Preview</h2>
            {!preview && (
              <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
                Awaiting Upload
              </span>
            )}
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide flex flex-col pb-20">
            {/* Main Preview Area */}
            {preview ? (
              <div className="mb-8 relative group w-full">
                <img src={preview} alt="preview" className="max-h-[400px] w-full object-contain rounded-[24px] border border-white/5 bg-[#0c0c0e] p-2 shadow-2xl" />
                <button 
                  onClick={() => { setPreview(null); setMessages([]); }}
                  className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-red-500/80 hover:border-red-500 transition-colors cursor-pointer"
                  title="Remove Photo"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center flex-1 mt-10">
                {/* Empty State UI */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 rounded-full border border-white/5 scale-150" />
                  <div className="absolute inset-0 rounded-full border border-white/5 scale-125" />
                  <div className="h-20 w-20 rounded-full bg-[#0c0c0e] border border-[#D4AF37]/20 flex items-center justify-center relative z-10">
                    <Sparkles className="h-8 w-8 text-[#D4AF37]" />
                  </div>
                </div>
                
                <h3 className="font-serif italic text-2xl text-white/90 mb-4">Your Style Preview Awaits</h3>
                <p className="text-sm text-white/40 max-w-sm leading-relaxed mb-12">
                  Upload an item to unlock personalized recommendations, curated alternatives, and complete styling insights.
                </p>

                {/* 2x2 Grid of Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md text-left">
                  {[
                    { label: "Curate My Look", color: "bg-[#D4AF37]" },
                    { label: "Generate Styling Ideas", color: "bg-[#D4AF37]" },
                    { label: "Complete the Outfit", color: "bg-[#D4AF37]" },
                    { label: "Shop the Style", color: "bg-[#D4AF37]" }
                  ].map(action => {
                    const isActive = activeAction === action.label;
                    return (
                      <button 
                        key={action.label} 
                        onClick={() => setActiveAction(action.label)}
                        className={`rounded-xl border p-4 flex items-center gap-3 transition-all ${
                          isActive 
                            ? "border-[#D4AF37]/50 bg-[#121215]" 
                            : "border-white/5 bg-[#0c0c0e] hover:bg-[#121215] hover:border-white/10"
                        }`}
                      >
                        <div className={`h-1.5 w-1.5 rounded-full ${action.color}`} />
                        <span className={`text-xs ${isActive ? "text-white" : "text-white/60"}`}>{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chat Results Area */}
            {messages.length > 0 && (
              <div className="space-y-6 mt-4">
                {messages.map((m) => {
                  if (m.kind === "text") {
                    return (
                      <div key={m.id} className={`max-w-[85%] px-5 py-4 rounded-2xl text-sm ${
                        m.role === "user"
                          ? "ml-auto bg-[#D4AF37] text-black"
                          : "bg-[#0c0c0e] border border-white/5 text-white/80"
                      }`}>
                        {m.text}
                      </div>
                    );
                  }
                  if (m.kind === "results") {
                    return (
                      <div key={m.id} className="grid grid-cols-2 gap-4">
                        {m.items.map((it) => (
                          <div key={it.id} className="rounded-2xl border border-white/5 bg-[#0c0c0e] overflow-hidden group flex flex-col">
                            <div className="aspect-square bg-[#121215] overflow-hidden relative flex items-center justify-center">
                              {it.thumb ? (
                                <img 
                                  src={it.thumb} 
                                  alt={it.title} 
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                  onError={(e) => {
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80";
                                  }}
                                />
                              ) : (
                                <Sparkles className="h-8 w-8 text-white/20" />
                              )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                              <p className="text-xs text-white/80 font-medium leading-tight line-clamp-2">{it.title}</p>
                              <p className="text-xs text-[#D4AF37] font-bold mt-2">{it.price}</p>
                              <a href={it.url} target="_blank" rel="noopener noreferrer"
                                className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] uppercase tracking-widest font-semibold py-2.5 transition-colors">
                                Shop Now <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
            
            {loading && (
              <div className="flex items-center gap-2 text-white/40 text-sm mt-6">
                <Loader2 className="h-4 w-4 animate-spin text-[#D4AF37]" /> Discovering styles…
              </div>
            )}
          </div>

          {/* Bottom Tags */}
          {!preview && messages.length === 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-auto pt-6">
              {["Work", "Casual", "Evening", "Travel", "Weekend"].map(tag => (
                <span key={tag} className="rounded-full border border-white/5 bg-[#0c0c0e] px-4 py-1.5 text-[10px] text-white/40">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
};

export default Stylist;
