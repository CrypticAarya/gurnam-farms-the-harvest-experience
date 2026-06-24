import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { getSession, getProfile, upsertProfile } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { DELIVERY_LOCATIONS } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/site/Navbar";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/dashboard/profile")({
  beforeLoad: async () => {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) throw redirect({ to: "/login", search: { redirect: "/dashboard/profile" } });
    const profile = await getProfile(userId);
    if (!profile || profile.role !== "customer") throw redirect({ to: "/" });
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { profile: authProfile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Use authProfile to initialize state. If it changes, update the local form state
  const [profile, setProfile] = useState(() => ({ 
    id: authProfile?.id ?? "",
    name: authProfile?.name ?? "", 
    phone: authProfile?.phone ?? "", 
    city: authProfile?.city ?? DELIVERY_LOCATIONS[0] ?? "" 
  } as any));

  useState(() => {
    if (authProfile) {
      setProfile({
        id: authProfile.id,
        name: authProfile.name ?? "",
        phone: authProfile.phone ?? "",
        city: authProfile.city ?? DELIVERY_LOCATIONS[0] ?? ""
      });
    }
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await upsertProfile({ id: profile.id, name: profile.name, phone: profile.phone, city: profile.city });
      await refreshProfile();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      logger.error("Profile upsert error", { err: String(err) });
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-3xl font-semibold text-forest-deep">Edit Profile</h1>
        
        <div className="mt-8 rounded-2xl border border-forest-deep/10 bg-white/90 p-8 shadow-lg">
          <form className="max-w-md space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-forest-deep">Name</label>
              <Input 
                className="mt-2 w-full rounded-xl border border-cream/50 bg-cream/30 px-4 py-3 outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold"
                value={profile.name ?? ""} 
                onChange={(e) => setProfile((s: any) => ({ ...s, name: e.target.value }))} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-forest-deep">Phone</label>
              <Input 
                className="mt-2 w-full rounded-xl border border-cream/50 bg-cream/30 px-4 py-3 outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold"
                value={profile.phone ?? ""} 
                onChange={(e) => setProfile((s: any) => ({ ...s, phone: e.target.value }))} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-forest-deep">Locality</label>
              <select 
                value={profile.city ?? DELIVERY_LOCATIONS[0]} 
                onChange={(e) => setProfile((s: any) => ({ ...s, city: e.target.value }))} 
                className="mt-2 w-full rounded-xl border border-cream/50 bg-cream/30 px-4 py-3 text-sm text-forest-deep outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold"
              >
                {DELIVERY_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            <Button className="w-full rounded-xl py-6 text-base font-semibold transition-all hover:scale-[1.02]" type="submit" disabled={loading}>
              {loading ? 'Saving Changes...' : 'Save Profile'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
