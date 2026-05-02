import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import heroImg from "@/assets/auth-hero.jpg";

const Auth = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = mode === "signin" ? "Sign In — Maison" : "Sign Up — Maison";
  }, [mode]);

  if (authLoading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { display_name: name },
          },
        });
        if (error) throw error;
        toast.success("Welcome. Check your inbox to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/dashboard`,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate("/dashboard");
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden lg:block relative overflow-hidden bg-secondary">
        <img
          src={heroImg}
          alt="Editorial fashion portrait"
          width={1024}
          height={1536}
          className="h-full w-full object-cover grayscale"
        />
        <div className="absolute bottom-10 left-10 right-10 text-foreground">
          <p className="font-serif text-3xl leading-tight">"Style is a way to say<br/>who you are without<br/>having to speak."</p>
          <p className="mt-4 text-xs uppercase tracking-editorial text-muted-foreground">Issue No. 01</p>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-editorial text-muted-foreground">Maison</p>
            <h1 className="mt-3 font-serif text-4xl">
              {mode === "signin" ? "Welcome back." : "Join the atelier."}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {mode === "signin" ? "Sign in to your wardrobe." : "Create an account to begin."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-editorial">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="h-11 rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-editorial">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-editorial">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="h-11 rounded-none border-0 border-b bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground" />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-none text-xs uppercase tracking-editorial">
              {mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] uppercase tracking-editorial text-muted-foreground">Or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="outline"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full h-12 rounded-none text-xs uppercase tracking-editorial"
          >
            <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.18v2.9h5.27c-.23 1.4-1.64 4.1-5.27 4.1-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.8 0 3.01.77 3.7 1.43l2.52-2.43C16.83 3.95 14.78 3 12.17 3 7.06 3 3 7.06 3 12.15s4.06 9.15 9.17 9.15c5.3 0 8.8-3.72 8.8-8.96 0-.6-.07-1.06-.16-1.24z"/></svg>
            Continue with Google
          </Button>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New here?" : "Already a member?"}{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-foreground underline underline-offset-4 hover:no-underline"
            >
              {mode === "signin" ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Auth;
