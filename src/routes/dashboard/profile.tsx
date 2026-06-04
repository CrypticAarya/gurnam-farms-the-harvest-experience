import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { getSession, getProfile, upsertProfile } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { DELIVERY_LOCATIONS } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/dashboard/profile")({
  beforeLoad: async () => {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) throw redirect({ to: "/login" });
    const profile = await getProfile(userId);
    if (!profile || profile.role !== "customer") throw redirect({ to: "/" });
  },
  component: ProfilePage,
});

function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(() => ({ name: "", phone: "", city: DELIVERY_LOCATIONS[0] ?? "" } as any));

  useState(() => {
    void (async () => {
      const session = await getSession();
      const userId = session?.user?.id;
      if (!userId) return;
      const p = await getProfile(userId);
      if (p) setProfile(p as any);
    })();
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await upsertProfile({ id: profile.id, name: profile.name, phone: profile.phone, city: profile.city });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      logger.error("Profile upsert error", { err: String(err) });
    }
  };

  return (
    <div className="min-h-screen bg-cream p-6">
      <h1 className="text-2xl font-semibold text-forest-deep">Edit Profile</h1>
      <form className="mt-6 max-w-md" onSubmit={handleSubmit}>
        <label className="block text-sm text-forest-deep">Name</label>
        <Input value={profile.name ?? ""} onChange={(e) => setProfile((s: any) => ({ ...s, name: e.target.value }))} />
        <label className="mt-4 block text-sm text-forest-deep">Phone</label>
        <Input value={profile.phone ?? ""} onChange={(e) => setProfile((s: any) => ({ ...s, phone: e.target.value }))} />
        <label className="mt-4 block text-sm text-forest-deep">Locality</label>
        <select value={profile.city ?? DELIVERY_LOCATIONS[0]} onChange={(e) => setProfile((s: any) => ({ ...s, city: e.target.value }))} className="w-full rounded-full border border-cream/25 bg-cream/10 px-4 py-3 text-sm text-forest-deep outline-none transition-colors focus:border-gold">
          {DELIVERY_LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <Button className="mt-6" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
      </form>
    </div>
  );
}
