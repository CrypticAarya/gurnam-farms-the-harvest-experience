import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSession, getProfile, fetchReservationsByProfile, fetchProgressByReservation } from "@/lib/supabase";
import { Navbar } from "@/components/site/Navbar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/")({
  beforeLoad: async () => {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) throw redirect({ to: "/login" });
    const profile = await getProfile(userId);
    if (!profile || profile.role !== "customer") throw redirect({ to: "/" });
  },
  component: DashboardIndex,
});

function DashboardIndex() {
  const profileQuery = useQuery({ queryKey: ["user", "profile"], queryFn: getProfile });
  const reservationsQuery = useQuery({ queryKey: ["user", "reservations"], queryFn: fetchReservationsByProfile });

  const latest = reservationsQuery.data?.[0] ?? null;

  const progressQuery = useQuery({
    queryKey: ["reservations", latest?.id, "progress"],
    queryFn: () => (latest ? fetchProgressByReservation(latest.id) : null),
    enabled: !!latest,
    refetchInterval: 10000,
  });

  const progressSteps = [
    { key: "reservation_received", label: "Reservation Received" },
    { key: "farm_preparation", label: "Farm Preparation" },
    { key: "harvest_ready", label: "Harvest Ready" },
    { key: "harvested", label: "Harvested" },
    { key: "week_1_delivered", label: "Week 1 Delivered" },
    { key: "week_2_delivered", label: "Week 2 Delivered" },
    { key: "week_3_delivered", label: "Week 3 Delivered" },
    { key: "week_4_delivered", label: "Week 4 Delivered" },
    { key: "week_5_delivered", label: "Week 5 Delivered" },
    { key: "week_6_delivered", label: "Week 6 Delivered" },
    { key: "week_7_delivered", label: "Week 7 Delivered" },
  ] as const;

  const completedSteps = progressQuery.data
    ? progressSteps.filter((step) => (progressQuery.data as any)[step.key]).length
    : 0;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-3xl font-semibold text-forest-deep">My Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome back{profileQuery.data?.name ? `, ${profileQuery.data.name}` : ""}.</p>

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
                <Button className="mt-2">Make a Reservation</Button>
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
                    {latest.selected_vegetables.map((veg) => (
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

              {/* Progress Section */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-forest-deep">Harvest Progress</h3>
                  {progressQuery.data && (
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(progressQuery.data.updated_at).toLocaleString()}
                    </p>
                  )}
                </div>

                {progressQuery.isLoading ? (
                  <div className="mt-4 rounded-2xl border border-forest-deep/10 bg-white/90 p-6">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                      <p className="text-sm text-muted-foreground">Loading progress...</p>
                    </div>
                  </div>
                ) : progressQuery.isError ? (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
                    <p className="text-sm text-rose-700">Unable to load progress. Please refresh to try again.</p>
                  </div>
                ) : !progressQuery.data ? (
                  <div className="mt-4 rounded-2xl border border-dashed border-forest-deep/25 bg-forest-deep/5 p-6">
                    <p className="text-sm text-muted-foreground">Progress tracking not available yet.</p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2">
                    {/* Progress Bar */}
                    <div className="rounded-full bg-forest-deep/10 p-1">
                      <div
                        className="rounded-full bg-gradient-to-r from-gold to-emerald-600 px-3 py-1 text-center text-xs font-medium text-white transition-all"
                        style={{ width: `${(completedSteps / progressSteps.length) * 100}%` }}
                      >
                        {completedSteps}/{progressSteps.length}
                      </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="mt-4 space-y-2">
                      {progressSteps.map((step, idx) => {
                        const isCompleted = (progressQuery.data as any)[step.key];
                        return (
                          <div key={step.key} className="flex items-center gap-3">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${isCompleted ? "bg-emerald-600 text-white" : "bg-forest-deep/10 text-muted-foreground"}`}>
                              {isCompleted ? "✓" : idx + 1}
                            </div>
                            <span className={`text-sm ${isCompleted ? "font-medium text-forest-deep" : "text-muted-foreground"}`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
