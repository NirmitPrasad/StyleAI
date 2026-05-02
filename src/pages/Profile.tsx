import { TopNav } from "@/components/TopNav";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera, Sparkles } from "lucide-react";

type StyleAnalysis = {
  score: number;
  aesthetic: string[];
  advice: string[];
};

async function postStyleRating(facePhoto: string | null): Promise<StyleAnalysis> {
  // TODO: wire up to FastAPI: POST /api/style-rating
  // const fd = new FormData(); fd.append("face", file);
  // const res = await fetch("/api/style-rating", { method: "POST", body: fd });
  // return res.json();
  await new Promise((r) => setTimeout(r, 2200));
  return {
    score: 8.4,
    aesthetic: ["Minimalist Chic", "Quiet Luxury"],
    advice: [
      "Lean into monochrome layering with one tactile texture per look.",
      "Introduce a sculptural accessory to anchor your softer silhouettes.",
      "Edit your closet quarterly — your strongest pieces deserve room to breathe.",
    ],
  };
}

const Profile = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [facePhoto, setFacePhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<StyleAnalysis | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Profile — Maison";
  }, []);

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
    const a = await postStyleRating(facePhoto);
    setAnalysis(a);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-2xl px-5 sm:px-8 py-10 sm:py-16">
        <p className="text-xs uppercase tracking-editorial text-muted-foreground">Account</p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Profile</h1>

        <div className="mt-10 space-y-6">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-editorial">Email</Label>
            <Input value={user?.email ?? ""} disabled className="h-11 rounded-none border-0 border-b bg-transparent px-0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dn" className="text-xs uppercase tracking-editorial">Display name</Label>
            <Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-11 rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="av" className="text-xs uppercase tracking-editorial">Avatar URL</Label>
            <Input id="av" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="h-11 rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" />
          </div>
          <Button onClick={save} disabled={saving} className="h-12 rounded-none text-xs uppercase tracking-editorial px-8">
            Save changes
          </Button>
        </div>

        {/* Face photo */}
        <section className="mt-16 border-t border-border pt-12">
          <p className="text-xs uppercase tracking-editorial text-muted-foreground">AI Styling</p>
          <h2 className="mt-3 font-serif text-3xl">Face Photo</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Used to personalize your AI styling recommendations.
          </p>

          <div className="mt-6 flex items-center gap-6">
            <div className="h-28 w-28 border border-border bg-secondary overflow-hidden flex items-center justify-center">
              {facePhoto ? (
                <img src={facePhoto} alt="Face" className="h-full w-full object-cover" />
              ) : (
                <Camera className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input ref={fileRef} type="file" accept="image/*" onChange={onFaceUpload} className="hidden" />
              <Button
                variant="outline"
                onClick={() => fileRef.current?.click()}
                className="h-11 rounded-none text-xs uppercase tracking-editorial"
              >
                {facePhoto ? "Replace photo" : "Upload photo"}
              </Button>
              {facePhoto && (
                <button onClick={() => setFacePhoto(null)} className="text-[10px] uppercase tracking-editorial text-muted-foreground hover:text-foreground">
                  Remove
                </button>
              )}
            </div>
          </div>
        </section>

        {/* My current style */}
        <section className="mt-16 border-t border-border pt-12">
          <p className="text-xs uppercase tracking-editorial text-muted-foreground">Aesthetic</p>
          <h2 className="mt-3 font-serif text-3xl">My Current Style</h2>

          <Button
            onClick={analyze}
            disabled={analyzing}
            className="mt-6 h-12 rounded-none text-xs uppercase tracking-editorial px-6"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {analyzing ? "Analyzing…" : "Analyze My Style"}
          </Button>

          {analyzing && (
            <div className="mt-10 border border-border bg-card p-10 overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-px bg-foreground animate-[scan_2s_ease-in-out_infinite]" />
              <p className="text-center font-serif text-xl italic text-muted-foreground">
                Reading the threads of your aesthetic…
              </p>
              <style>{`@keyframes scan { 0%{transform:translateY(0)} 50%{transform:translateY(120px)} 100%{transform:translateY(0)} }`}</style>
            </div>
          )}

          {analysis && !analyzing && (
            <div className="mt-10 border border-border bg-card p-8 space-y-8">
              <div>
                <p className="text-[10px] uppercase tracking-editorial text-muted-foreground">Style Score</p>
                <p className="mt-2 font-serif text-7xl">
                  {analysis.score}
                  <span className="text-2xl text-muted-foreground"> / 10</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-editorial text-muted-foreground">Aesthetic</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {analysis.aesthetic.map((a) => (
                    <span key={a} className="px-3 py-1 border border-border text-xs uppercase tracking-editorial">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-editorial text-muted-foreground">Advice</p>
                <ul className="mt-3 space-y-3">
                  {analysis.advice.map((a, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-serif text-muted-foreground">{i + 1}.</span>
                      <span className="text-sm">{a}</span>
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
