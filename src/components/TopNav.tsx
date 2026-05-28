import { Link, NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Shirt, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWeather, ConditionIcon } from "@/components/WeatherWidget";

const links = [
  { to: "/dashboard", label: "Home" },
  { to: "/stylist", label: "AI Stylist" },
  { to: "/closet", label: "My Closet" },
];

export const TopNav = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null } | null>(null);
  const { weather, loading: loadingWeather } = useWeather();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  const initials = (profile?.display_name || user?.email || "?")
    .split(/\s+|@/)[0]
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <img src="/logo.jpg" alt="StyleAI Logo" className="h-8 w-8 rounded-lg object-cover" />
          <span className="font-bold text-lg tracking-tight">StyleAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "relative py-1 transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-primary" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {user ? (
          <div className="flex items-center gap-4">
            {!loadingWeather && weather && (
              <div className="flex items-center gap-2 select-none">
                <ConditionIcon c={weather.condition} />
                <div className="text-right leading-none">
                  <p className="font-bold text-sm">{weather.tempC}°</p>
                  <p className="text-[8px] uppercase tracking-widest text-muted-foreground mt-0.5">
                    {weather.condition}
                  </p>
                </div>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-secondary">
                  <Avatar className="h-10 w-10 border border-border">
                    {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
                    <AvatarFallback className="bg-gradient-primary text-black text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">{profile?.display_name || "Welcome"}</span>
                    <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserIcon className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/closet")}>
                  <Shirt className="mr-2 h-4 w-4" /> My Closet
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button onClick={() => navigate("/auth")} variant="outline" className="rounded-xl px-5">
            Log In
          </Button>
        )}
      </div>
    </header>
  );
};
