import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, UserPlus, LogIn } from "lucide-react";
import { TopNav } from "@/components/TopNav";

const Auth = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = mode === "signin" ? "Log In — StyleAI" : "Join StyleAI";
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
            data: { display_name: email.split("@")[0] },
          },
        });
        if (error) throw error;
        // Try immediate sign-in (works when email confirmation is disabled)
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInErr) navigate("/dashboard");
        else toast.success("Account created. Check your email to confirm.");
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
    <div className="min-h-screen">
      <TopNav />
      <main className="flex items-center justify-center px-5 py-16 sm:py-24">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-8 sm:p-10 shadow-glow">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">
              {mode === "signup" ? "Join StyleAI" : "Welcome Back"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signup" ? "Create an account to start styling" : "Log in to your wardrobe"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email Address</Label>
              <Input
                id="email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl bg-secondary/60 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password" type="password" required minLength={6}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl bg-secondary/60 border-border"
              />
            </div>

            <Button
              type="submit" disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold shadow-glow hover:opacity-90"
            >
              {mode === "signup" ? <><UserPlus className="mr-2 h-4 w-4"/>Create Account</> : <><LogIn className="mr-2 h-4 w-4"/>Log In</>}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="outline" onClick={handleGoogle} disabled={loading}
            className="w-full h-12 rounded-xl border-border bg-secondary/40"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.18v2.9h5.27c-.23 1.4-1.64 4.1-5.27 4.1-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.8 0 3.01.77 3.7 1.43l2.52-2.43C16.83 3.95 14.78 3 12.17 3 7.06 3 3 7.06 3 12.15s4.06 9.15 9.17 9.15c5.3 0 8.8-3.72 8.8-8.96 0-.6-.07-1.06-.16-1.24z"/></svg>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
            <button
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="text-gradient font-semibold"
            >
              {mode === "signup" ? "Sign In" : "Create Account"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Auth;
