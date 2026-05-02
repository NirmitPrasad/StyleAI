import { TopNav } from "@/components/TopNav";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-2xl px-5 sm:px-8 py-12 sm:py-20">
        <p className="text-xs uppercase tracking-editorial text-muted-foreground">Account</p>
        <h1 className="mt-3 font-serif text-5xl">Profile</h1>

        <div className="mt-12 space-y-6">
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
      </main>
    </div>
  );
};

export default Profile;
