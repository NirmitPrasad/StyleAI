import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { TopNav } from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Sparkles, Shirt } from "lucide-react";

const features = [
  { icon: Camera, color: "text-[#D4AF37]", title: "Smart Digitization", desc: "Simply snap a photo of your clothes. Our AI instantly removes the background and categorizes every item in your digital closet." },
  { icon: Sparkles, color: "text-[#D4AF37]", title: "AI Outfit Generation", desc: "Never ask 'what should I wear?' again. Get personalized outfit pairings based on the weather, occasion, and your unique style." },
  { icon: Shirt, color: "text-[#D4AF37]", title: "Trend Analysis", desc: "See how your wardrobe aligns with current fashion trends and get recommendations on what key pieces you might be missing." },
];

const Index = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
        <section className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>Powered by Advanced AI</span>
          </div>
          <h1 className="mt-6 text-5xl sm:text-7xl font-bold leading-[1.05]">
            Your Personal<br />
            <span className="text-gradient">Fashion Stylist</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-muted-foreground">
            Upload your wardrobe, discover your aesthetic, and get daily outfit recommendations tailored just for you.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/auth">
              <Button className="h-12 rounded-xl bg-gradient-primary text-white px-6 shadow-glow hover:opacity-90">
                Get Styled Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" className="h-12 rounded-xl px-6 border-border bg-secondary/40">
                Upload Wardrobe
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-20 sm:mt-28 grid gap-5 sm:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="rounded-3xl border border-border bg-card/60 backdrop-blur p-6 sm:p-7 hover:border-primary/40 transition-colors">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary">
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="mt-5 text-xl font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Index;
