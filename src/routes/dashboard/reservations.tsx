import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchUserReservations, getSession, getProfile, type ReservationRow } from "@/lib/supabase";
import { Navbar } from "@/components/site/Navbar";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-3xl font-semibold text-forest-deep">My Reservations</h1>
        
        {query.isLoading ? (
          <div className="mt-8 rounded-2xl border border-forest-deep/10 bg-white/90 p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              <p className="text-sm text-muted-foreground">Loading your history...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-forest-deep/25 bg-forest-deep/5 p-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="text-4xl">🧾</div>
              <h3 className="font-semibold text-forest-deep">No reservation history</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                You haven't made any reservations yet.
              </p>
              <Link to="/reserve">
                <Button className="mt-4">Make a Reservation</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {items.map((r: ReservationRow) => (
              <div key={r.id} className="rounded-2xl border border-forest-deep/10 bg-white/90 p-6 shadow-lg transition-transform hover:scale-[1.01]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Reservation Date</p>
                    <p className="mt-1 font-semibold text-forest-deep">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    (r.status || "Pending") === "Confirmed" ? "bg-orange-100 text-orange-800" :
                    (r.status || "Pending") === "Delivered" ? "bg-emerald-100 text-emerald-800" :
                    "bg-amber-100 text-amber-800"
                  }`}>
                    {(r.status || "Pending").toUpperCase()}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery Area</p>
                    <p className="mt-1 font-medium text-gold">{r.delivery_area}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="mt-1 font-medium text-forest-deep">{r.quantity ?? 1} Box{(r.quantity ?? 1) > 1 ? "es" : ""}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Contact</p>
                    <p className="mt-1 text-xs font-medium text-forest-deep">{r.phone_number}</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-forest-deep/10 pt-6">
                  <p className="text-xs text-muted-foreground">Selected Vegetables</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.selected_vegetables.map((veg: string) => (
                      <span key={veg} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        {veg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
