import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchUserReservations, getSession, getProfile, type ReservationRow } from "@/lib/supabase";

export const Route = createFileRoute("/dashboard/reservations")({
  beforeLoad: async () => {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) throw redirect({ to: "/login", search: { redirect: "/dashboard/reservations" } });
    const profile = await getProfile(userId);
    if (!profile || profile.role !== "customer") throw redirect({ to: "/" });
  },
  component: ReservationsPage,
});

function ReservationsPage() {
  const query = useQuery({
    queryKey: ["user", "reservations"],
    queryFn: () => fetchUserReservations(),
  });
  const items = (query.data as ReservationRow[]) ?? [];

  return (
    <div className="min-h-screen bg-cream p-6">
      <h1 className="text-2xl font-semibold text-forest-deep">My Reservations</h1>
      <ul className="mt-4 space-y-3">
        {items.map((r: ReservationRow) => (
          <li key={r.id} className="rounded-md border bg-white/90 p-4">{r.full_name} — {r.delivery_area} — {new Date(r.created_at).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}
