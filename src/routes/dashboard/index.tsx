import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSession, getProfile, fetchReservationsByProfile } from "@/lib/supabase";
import { Navbar } from "@/components/site/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/dashboard/")({
  beforeLoad: async () => {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) throw redirect({ to: "/login", search: { redirect: "/dashboard" } });
    const profile = await getProfile(userId);
    if (!profile || profile.role !== "customer") throw redirect({ to: "/" });
  },
  component: DashboardIndex,
});

function DashboardIndex() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const reservationsQuery = useQuery({ queryKey: ["user", "reservations"], queryFn: () => fetchReservationsByProfile() });

  const latest = reservationsQuery.data?.[0] ?? null;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-3xl font-semibold text-forest-deep">My Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome back{profile?.name ? `, ${profile.name}` : ""}.</p>

        {/* Reservations Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-forest-deep">Reservation Details</h2>

          {/* Loading State */}
          {reservationsQuery.isLoading ? (
            <div className="mt-6 rounded-2xl border border-forest-deep/10 bg-white/90 p-8">
              <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                <p className="text-sm text-muted-foreground">Loading your reservations...</p>
              </div>
            </div>
          ) : reservationsQuery.isError ? (
            /* Error State */
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-6">
              <div className="flex flex-col gap-3">
                <p className="font-medium text-rose-900">Unable to load reservations</p>
                <p className="text-sm text-rose-700">There was an error retrieving your reservation data. Please try refreshing the page.</p>
                {reservationsQuery.error && (
                  <div className="rounded-md bg-rose-100 p-2 text-xs font-mono text-rose-800 break-words">
                    Error details: {reservationsQuery.error instanceof Error ? reservationsQuery.error.message : String(reservationsQuery.error)}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => reservationsQuery.refetch()}
                  className="w-fit border-rose-300 text-rose-900 hover:bg-rose-100"
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : !latest ? (
            /* Empty State */
            <div className="mt-6 rounded-2xl border border-dashed border-forest-deep/25 bg-forest-deep/5 p-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="text-4xl">🌱</div>
                <h3 className="font-semibold text-forest-deep">No reservations yet</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  You haven't made a weekly harvest reservation yet. Start your farm-to-home experience today!
                </p>
                <Button className="mt-2" onClick={() => navigate({ to: "/reserve" })}>Make a Reservation</Button>
              </div>
            </div>
          ) : (
            /* Reservation Details */
            <div className="mt-6 space-y-6">
              {/* Status Summary Card */}
              <div className="rounded-2xl border border-forest-deep/10 bg-white/90 p-6 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Reservation Date</p>
                    <p className="mt-1 font-semibold text-forest-deep">{new Date(latest.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="rounded-lg bg-gold/10 px-3 py-2 text-sm font-medium text-gold">Active</div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery Area</p>
                    <p className="mt-1 font-medium text-gold">{latest.delivery_area}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery Address</p>
                    <p className="mt-1 max-w-xs truncate text-xs font-medium">{latest.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Contact</p>
                    <p className="mt-1 text-xs font-medium">{latest.phone_number}</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-forest-deep/10 pt-6">
                  <p className="text-xs text-muted-foreground">Selected Vegetables</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {latest.selected_vegetables.map((veg: string) => (
                      <span key={veg} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        {veg}
                      </span>
                    ))}
                  </div>
                </div>

                {latest.notes && (
                  <div className="mt-6 border-t border-forest-deep/10 pt-6">
                    <p className="text-xs text-muted-foreground">Special Notes</p>
                    <p className="mt-2 text-sm">{latest.notes}</p>
                  </div>
                )}
              </div>

              {/* Order Status Section */}
              <div className="rounded-2xl border border-forest-deep/10 bg-white/90 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-forest-deep">Order Status</h3>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-forest-deep/5 p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Fulfillment Status</p>
                    <p className="mt-1 font-semibold text-forest-deep">
                      {latest.status || "Pending"}
                    </p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      (latest.status || "Pending") === "Confirmed" ? "bg-orange-100 text-orange-800" :
                      (latest.status || "Pending") === "Delivered" ? "bg-emerald-100 text-emerald-800" :
                      "bg-amber-100 text-amber-800"
                    }`}>
                      {(latest.status || "Pending").toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Quantity Reserved</p>
                  <p className="mt-1 font-medium text-forest-deep">{latest.quantity ?? 1} Box{(latest.quantity ?? 1) > 1 ? "es" : ""}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
