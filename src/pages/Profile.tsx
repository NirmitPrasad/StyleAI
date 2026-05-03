import { TopNav } from "@/components/TopNav";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera, Sparkles } from "lucide-react";
import { rateStyle, type StyleAnalysis } from "@/lib/api";

const closet = [
  { name: "Silk Slip Dress", category: "Dresses", tags: ["Party"] },
  { name: "Wool Trench", category: "Outerwear", tags: ["Formal"] },
  { name: "Cashmere Knit", category: "Knitwear", tags: ["Casual"] },
];

const Profile = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [facePhoto, setFacePhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<StyleAnalysis | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { document.title = "Profile — StyleAI"; }, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setDisplayName(data?.display_name ?? "");
        setAvatarUrl(data?.avatar_url ?? "");
      });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, avatar_url: avatarUrl })
      .eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  };

  const onFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFacePhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const a = await rateStyle({ facePhoto, closet });
      setAnalysis(a);
    } catch (e: any) {
      toast.error(e.message || "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-2xl px-5 sm:px-8 py-10 sm:py-16">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Account</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold">Profile</h1>

        <div className="mt-10 space-y-5 rounded-3xl border border-border bg-card/60 backdrop-blur p-6 sm:p-8">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Email</Label>
            <Input value={user?.email ?? ""} disabled className="h-12 rounded-xl bg-secondary/60" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dn" className="text-xs uppercase tracking-widest text-muted-foreground">Display name</Label>
            <Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-12 rounded-xl bg-secondary/60" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="av" className="text-xs uppercase tracking-widest text-muted-foreground">Avatar URL</Label>
            <Input id="av" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="h-12 rounded-xl bg-secondary/60" />
          </div>
          <Button onClick={save} disabled={saving} className="rounded-xl bg-gradient-primary text-white px-6 h-12 shadow-glow hover:opacity-90">
            Save changes
          </Button>
        </div>

        {/* Face photo */}
        <section className="mt-10 rounded-3xl border border-border bg-card/60 backdrop-blur p-6 sm:p-8">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">AI Styling</p>
          <h2 className="mt-2 text-2xl font-bold">Face Photo</h2>
          <p className="mt-1 text-sm text-muted-foreground">Used to personalize your AI styling recommendations.</p>

          <div className="mt-6 flex items-center gap-6">
            <div className="h-28 w-28 rounded-2xl border border-border bg-secondary overflow-hidden flex items-center justify-center">
              {facePhoto ? (
                <img src={facePhoto} alt="Face" className="h-full w-full object-cover" />
              ) : (
                <Camera className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input ref={fileRef} type="file" accept="image/*" onChange={onFaceUpload} className="hidden" />
              <Button variant="outline" onClick={() => fileRef.current?.click()} className="rounded-xl bg-secondary/40">
                {facePhoto ? "Replace photo" : "Upload photo"}
              </Button>
              {facePhoto && (
                <button onClick={() => setFacePhoto(null)} className="text-xs text-muted-foreground hover:text-foreground">
                  Remove
                </button>
              )}
            </div>
          </div>
        </section>

        {/* My current style */}
        <section className="mt-10 rounded-3xl border border-border bg-card/60 backdrop-blur p-6 sm:p-8">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Aesthetic</p>
          <h2 className="mt-2 text-2xl font-bold">My Current Style</h2>

          <Button onClick={analyze} disabled={analyzing} className="mt-5 rounded-xl bg-gradient-primary text-white px-6 h-12 shadow-glow hover:opacity-90">
            <Sparkles className="mr-2 h-4 w-4" />
            {analyzing ? "Analyzing…" : "Analyze My Style"}
          </Button>

          {analyzing && (
            <div className="mt-6 rounded-2xl border border-border bg-secondary/40 p-8 overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-primary animate-[scan_2s_ease-in-out_infinite]" />
              <p className="text-center italic text-muted-foreground">Reading the threads of your aesthetic…</p>
              <style>{`@keyframes scan { 0%{transform:translateY(0)} 50%{transform:translateY(120px)} 100%{transform:translateY(0)} }`}</style>
            </div>
          )}

          {analysis && !analyzing && (
            <div className="mt-6 rounded-2xl border border-border bg-secondary/40 p-6 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Style Score</p>
                <p className="mt-1 text-6xl font-bold text-gradient">
                  {analysis.score}
                  <span className="text-2xl text-muted-foreground"> / 10</span>
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Aesthetic</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {analysis.aesthetic.map((a) => (
                    <span key={a} className="rounded-full bg-gradient-primary/20 border border-primary/30 px-3 py-1 text-xs font-semibold">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Advice</p>
                <ul className="mt-2 space-y-2">
                  {analysis.advice.map((a, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="text-gradient font-bold">{i + 1}.</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Profile;
