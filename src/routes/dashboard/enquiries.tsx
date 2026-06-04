import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchUserEnquiries, getSession, getProfile } from "@/lib/supabase";

export const Route = createFileRoute("/dashboard/enquiries")({
  beforeLoad: async () => {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) throw redirect({ to: "/login" });
    const profile = await getProfile(userId);
    if (!profile || profile.role !== "customer") throw redirect({ to: "/" });
  },
  component: EnquiriesPage,
});

function EnquiriesPage() {
  const query = useQuery({ queryKey: ["user", "enquiries"], queryFn: fetchUserEnquiries });
  const items = query.data ?? [];

  return (
    <div className="min-h-screen bg-cream p-6">
      <h1 className="text-2xl font-semibold text-forest-deep">My Enquiries</h1>
      <ul className="mt-4 space-y-3">
        {items.map((r: any) => (
          <li key={r.id} className="rounded-md border bg-white/90 p-4">{r.message} — {r.created_at}</li>
        ))}
      </ul>
    </div>
  );
}
