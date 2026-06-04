import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSession, getProfile, fetchReservationsByProfile, fetchProgressByReservation } from "@/lib/supabase";
import { Navbar } from "@/components/site/Navbar";

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

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-3xl font-semibold text-forest-deep">My Dashboard</h1>
        <p className="mt-4 text-muted-foreground">Welcome back{profileQuery.data?.name ? `, ${profileQuery.data.name}` : ""}.</p>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-forest-deep">Reservation Details</h2>
          {reservationsQuery.isLoading ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading reservations...</p>
          ) : !latest ? (
            <p className="mt-4 text-sm text-muted-foreground">You have no reservations yet.</p>
          ) : (
            <div className="mt-4 rounded-2xl border border-forest-deep/10 bg-white/90 p-6">
              <p className="text-sm text-muted-foreground">Reservation Date</p>
              <p className="font-medium">{new Date(latest.created_at).toLocaleString()}</p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Area</p>
                  <p className="font-medium text-gold">{latest.delivery_area}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium max-w-xs truncate text-xs">{latest.address}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Selected Vegetables</p>
                <p className="mt-1 text-sm">{latest.selected_vegetables.join(", ")}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-forest-deep">Harvest Progress</h3>
                {progressQuery.isLoading ? (
                  <p className="mt-2 text-sm text-muted-foreground">Loading progress...</p>
                ) : !progressQuery.data ? (
                  <p className="mt-2 text-sm text-muted-foreground">Progress not available yet.</p>
                ) : (
                  <ul className="mt-3 space-y-2 text-sm">
                    <li>{progressQuery.data.reservation_received ? "✓" : "○"} Reservation Received</li>
                    <li>{progressQuery.data.farm_preparation ? "✓" : "○"} Farm Preparation</li>
                    <li>{progressQuery.data.harvest_ready ? "✓" : "○"} Harvest Ready</li>
                    <li>{progressQuery.data.harvested ? "✓" : "○"} Harvested</li>
                    <li>{progressQuery.data.week_1_delivered ? "✓" : "○"} Week 1 Delivered</li>
                    <li>{progressQuery.data.week_2_delivered ? "✓" : "○"} Week 2 Delivered</li>
                    <li>{progressQuery.data.week_3_delivered ? "✓" : "○"} Week 3 Delivered</li>
                    <li>{progressQuery.data.week_4_delivered ? "✓" : "○"} Week 4 Delivered</li>
                    <li>{progressQuery.data.week_5_delivered ? "✓" : "○"} Week 5 Delivered</li>
                    <li>{progressQuery.data.week_6_delivered ? "✓" : "○"} Week 6 Delivered</li>
                    <li>{progressQuery.data.week_7_delivered ? "✓" : "○"} Week 7 Delivered</li>
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
