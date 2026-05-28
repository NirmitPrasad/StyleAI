import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
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

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) throw error;
      toast.success("Password reset link sent to your email!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden flex flex-col justify-center border-t-2 border-[#D4AF37]/50 shadow-[0_1px_10px_rgba(212,175,55,0.15)] py-12 lg:py-6 w-full">
      {/* Floating Logo and Brand Name at Top Left */}
      <div className="absolute top-6 left-6 lg:left-10 z-20 flex items-center gap-2.5 select-none cursor-pointer" onClick={() => navigate("/")}>
        <img src="/logo.jpg" alt="StyleAI Logo" className="h-8 w-8 rounded-lg object-cover" />
        <span className="font-bold text-lg tracking-tight text-white">StyleAI</span>
      </div>

      <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-8 lg:gap-6 relative z-10">
        
        {/* Left Column: Info & Features */}
        <div className="w-full lg:w-[38%] flex flex-col justify-between pt-16 lg:pt-8 pb-4 lg:pb-0 relative z-10">
          {/* Feature List Content Container */}
          <div className="max-w-xl">
            {/* Tagline */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-[#D4AF37]/50" />
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">
                THE FUTURE OF AI FASHION
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-[56px] leading-[1.15] text-white font-normal tracking-wide">
              Your Personal <br />
              AI <span className="italic text-[#D4AF37] font-editorial-serif pr-2">Fashion Stylist</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-[#D4AF37]/70 italic font-light font-editorial-serif text-base sm:text-lg leading-relaxed max-w-lg">
              Upload your fashion pieces, discover curated outfit recommendations, explore personalized styling inspiration, and transform your wardrobe with intelligent AI-powered fashion insights.
            </p>

            {/* Core features list */}
            <ul className="mt-10 space-y-4">
              {[
                "Smart Outfit Recommendations",
                "AI-Powered Style Matching",
                "Personalized Wardrobe Insights",
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-4 group">
                  <div className="w-5 h-5 rounded-full border border-[#D4AF37] bg-transparent flex items-center justify-center text-[10px] text-[#D4AF37] font-bold select-none shrink-0">
                    +
                  </div>
                  <span className="font-editorial-serif text-white/90 text-base sm:text-lg font-light tracking-wide border-b border-white/5 pb-0.5 group-hover:border-[#D4AF37]/35 transition-colors">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full">
            <div className="rounded-[18px] border border-[#D4AF37]/15 bg-[#0c0c0e]/40 p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#D4AF37]/35 transition-all duration-300">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]/75 font-semibold font-sans block">
                  WARDROBE
                </span>
                <span className="font-editorial-serif text-3.5xl font-normal text-white/95 mt-1 block">
                  36
                </span>
                <span className="text-xs text-white/40 font-light font-editorial-serif italic mt-1 block">
                  curated looks
                </span>
              </div>
              <Sparkle className="absolute top-5 right-5 h-3.5 w-3.5 text-[#D4AF37]/45" />
            </div>

            <div className="rounded-[18px] border border-[#D4AF37]/15 bg-[#0c0c0e]/40 p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#D4AF37]/35 transition-all duration-300">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]/75 font-semibold font-sans block">
                  MATCH SCORE
                </span>
                <span className="font-editorial-serif text-3.5xl font-normal text-white/95 mt-1 block">
                  98%
                </span>
                <span className="text-xs text-white/40 font-light font-editorial-serif italic mt-1 block">
                  style accuracy
                </span>
              </div>
              <Sparkle className="absolute top-5 right-5 h-3.5 w-3.5 text-[#D4AF37]/45" />
            </div>

            <div className="rounded-[18px] border border-[#D4AF37]/15 bg-[#0c0c0e]/40 p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#D4AF37]/35 transition-all duration-300">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]/75 font-semibold font-sans block">
                  OCCASIONS
                </span>
                <span className="font-editorial-serif text-3.5xl font-normal text-white/95 mt-1 block">
                  7+
                </span>
                <span className="text-xs text-white/40 font-light font-editorial-serif italic mt-1 block">
                  styled categories
                </span>
              </div>
              <Sparkle className="absolute top-5 right-5 h-3.5 w-3.5 text-[#D4AF37]/45" />
            </div>
          </div>
        </div>

        {/* Middle Column: Wardrobe Photo */}
        <div className="w-full lg:w-[22%] flex justify-center lg:items-stretch relative z-10 lg:pt-8 lg:pb-0">
          <img
            src="/wardrobe-login.png"
            alt="Wardrobe"
            className="w-full max-w-[280px] lg:max-w-full h-[380px] sm:h-[450px] lg:h-full object-cover rounded-[24px] shadow-2xl shadow-black/80"
          />
        </div>

        {/* Right Column: Authentication card form */}
        <div className="w-full lg:w-[40%] flex items-center justify-center relative z-10 lg:border-l lg:border-white/10 lg:pl-6">
          <div className="w-full max-w-md rounded-[28px] border border-[#D4AF37]/20 bg-[#0c0c0e] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Radial gradient background inside the card */}
            <div className="absolute -inset-px bg-gradient-to-b from-[#D4AF37]/10 to-transparent pointer-events-none rounded-[28px] -z-10" />

            {/* Top visual accent badge */}
            <div className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E5C060] to-[#B38F2D] flex items-center justify-center shadow-lg shadow-[#D4AF37]/15">
              <Sparkle className="h-6 w-6 text-black fill-black" />
            </div>

            <h2 className="font-editorial-serif text-3xl font-medium text-white/95 text-center leading-none mt-2">
              {mode === "signup" ? "Join StyleAI" : "Welcome Back"}
            </h2>
            <p className="font-editorial-serif text-xs font-light italic text-white/40 text-center mt-2.5">
              {mode === "signup" ? "Create an account to start styling" : "Log in to your wardrobe"}
            </p>

            {/* Switcher tabs */}
            <div className="grid grid-cols-2 rounded-xl border border-white/10 p-1 bg-[#050505] w-full mt-8 mb-6">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={cn(
                  "rounded-lg text-[10px] uppercase tracking-[0.2em] font-bold py-2.5 transition-all duration-300 cursor-pointer",
                  mode === "signup"
                    ? "bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37]"
                    : "text-white/40 border border-transparent hover:text-white/60"
                )}
              >
                SIGN UP
              </button>
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={cn(
                  "rounded-lg text-[10px] uppercase tracking-[0.2em] font-bold py-2.5 transition-all duration-300 cursor-pointer",
                  mode === "signin"
                    ? "bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37]"
                    : "text-white/40 border border-transparent hover:text-white/60"
                )}
              >
                LOG IN
              </button>
            </div>

            {/* Login or Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]/80 font-bold block">
                  EMAIL ADDRESS
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl bg-[#050505]/40 border-white/10 text-white placeholder-white/20 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]/80 font-bold block">
                  PASSWORD
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-[#050505]/40 border-white/10 text-white placeholder-white/20 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all"
                />

                {mode === "signin" && (
                  <div className="flex justify-end mt-1.5">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[10px] text-[#D4AF37]/80 hover:text-[#D4AF37] italic font-editorial-serif cursor-pointer bg-transparent border-none p-0"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-13 rounded-xl bg-gradient-to-r from-[#B38F2D] via-[#D4AF37] to-[#B38F2D] text-black hover:opacity-95 font-bold text-xs uppercase tracking-[0.25em] transition-all duration-300 flex items-center justify-center gap-2 mt-8 shadow-lg shadow-[#D4AF37]/10"
              >
                {mode === "signup" ? (
                  <>
                    <span className="text-sm font-light leading-none">+</span> CREATE ACCOUNT
                  </>
                ) : (
                  <>
                    <span className="text-sm font-light leading-none">✦</span> LOG IN
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/30">OR</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Google OAuth action */}
            <Button
              variant="outline"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full h-13 rounded-xl border-[#D4AF37]/30 bg-transparent text-white font-semibold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/50 transition-all duration-300 cursor-pointer"
            >
              <svg className="h-4 w-4 text-[#D4AF37]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.35 11.1h-9.18v2.9h5.27c-.23 1.4-1.64 4.1-5.27 4.1-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.8 0 3.01.77 3.7 1.43l2.52-2.43C16.83 3.95 14.78 3 12.17 3 7.06 3 3 7.06 3 12.15s4.06 9.15 9.17 9.15c5.3 0 8.8-3.72 8.8-8.96 0-.6-.07-1.06-.16-1.24z" />
              </svg>
              CONTINUE WITH GOOGLE
            </Button>

            {/* Footer switcher */}
            <p className="mt-8 text-center text-xs text-white/40 font-light font-editorial-serif italic">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("signin")}
                    className="text-[#D4AF37] hover:underline font-normal italic ml-1 cursor-pointer bg-transparent border-none p-0"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  New here?{" "}
                  <button
                    onClick={() => setMode("signup")}
                    className="text-[#D4AF37] hover:underline font-normal italic ml-1 cursor-pointer bg-transparent border-none p-0"
                  >
                    Create Account
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
