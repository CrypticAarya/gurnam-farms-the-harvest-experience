import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDashboardCounts, fetchRecentActivity, fetchAdminMetrics, getSession, isAdmin } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    logger.info("[admin/index] beforeLoad: Checking admin access");
    const session = await getSession();
    const userId = session?.user?.id;
    logger.info("[admin/index] Session user ID", { userId });

    if (!userId) {
      logger.warn("[admin/index] No userId in session, redirecting to /");
      throw redirect({ to: "/" });
    }

    const hasAdminAccess = await isAdmin(userId);
    if (!hasAdminAccess) {
      logger.warn("[admin/index] User is not admin, redirecting to /");
      throw redirect({ to: "/" });
    }
    logger.info("[admin/index] Admin access granted", { userId });
  },
  head: () => ({
    meta: [{ title: "Admin Dashboard — Gurnam Farms" }],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const countsQuery = useQuery({ queryKey: ["admin", "counts"], queryFn: fetchDashboardCounts });
  const metricsQuery = useQuery({ queryKey: ["admin", "metrics"], queryFn: fetchAdminMetrics });
  const activityQuery = useQuery({ queryKey: ["admin", "recent-activity"], queryFn: () => fetchRecentActivity(6) });

  const counts = countsQuery.data;
  const metrics = metricsQuery.data;
  const activity = activityQuery.data ?? [];

  return (
    <div className="space-y-6">
      {/* Reservation Metrics Section */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-forest-deep">Reservation Metrics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-gradient-to-br from-emerald-50 to-white/90">
            <CardHeader>
              <CardTitle className="text-sm">Total Customers</CardTitle>
              <CardDescription>Unique customers with reservations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-700">{metricsQuery.isLoading ? "—" : metrics?.totalCustomers ?? 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-white/90">
            <CardHeader>
              <CardTitle className="text-sm">Total Reservations</CardTitle>
              <CardDescription>All reservations submitted</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-700">{metricsQuery.isLoading ? "—" : metrics?.totalReservations ?? 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-white/90">
            <CardHeader>
              <CardTitle className="text-sm">Pending</CardTitle>
              <CardDescription>Awaiting processing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-700">{metricsQuery.isLoading ? "—" : metrics?.pendingReservations ?? 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-white/90">
            <CardHeader>
              <CardTitle className="text-sm">Confirmed</CardTitle>
              <CardDescription>Active processing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-700">{metricsQuery.isLoading ? "—" : metrics?.confirmedReservations ?? 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white/90">
            <CardHeader>
              <CardTitle className="text-sm">Delivered</CardTitle>
              <CardDescription>Successfully completed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-700">{metricsQuery.isLoading ? "—" : metrics?.deliveredReservations ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Engagement Section */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-forest-deep">Engagement & Growth</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle>Total Contact Enquiries</CardTitle>
              <CardDescription>All customer messages collected from the site.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold text-forest-deep">{countsQuery.isLoading ? "—" : counts?.contactCount ?? 0}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle>Harvest Reservations</CardTitle>
              <CardDescription>Reservations submitted for weekly boxes.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold text-forest-deep">{countsQuery.isLoading ? "—" : counts?.reservationCount ?? 0}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle>Total Newsletter Subscribers</CardTitle>
              <CardDescription>People waiting for the latest farm updates.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold text-forest-deep">{countsQuery.isLoading ? "—" : counts?.subscriberCount ?? 0}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest submissions across the site.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                {activityQuery.isLoading ? (
                  <p>Loading activity...</p>
                ) : activity.length === 0 ? (
                  <p>No recent activity yet.</p>
                ) : (
                  activity.slice(0, 5).map((item) => (
                    <div key={`${item.source}-${item.id}`} className="rounded-2xl bg-slate-50 p-3 text-foreground">
                      <p className="font-medium text-forest-deep">{item.title}</p>
                      <p>{item.details}</p>
                      <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Monitor enquiries, reservations, and newsletter growth from one place.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {countsQuery.isError ? (
              <p className="text-sm text-rose-600">Unable to load dashboard metrics.</p>
            ) : (
              <div className="rounded-3xl border border-forest-deep/10 bg-forest-deep/5 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Latest updates</p>
                <p className="mt-3 text-2xl font-semibold text-forest-deep">{(counts?.contactCount ?? 0) + (counts?.reservationCount ?? 0) + (counts?.subscriberCount ?? 0)}</p>
                <p className="mt-2 text-sm text-muted-foreground">Total recorded customer interactions.</p>
              </div>
            )}
            <div className="rounded-3xl border border-forest-deep/10 bg-forest-deep/5 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Healthy growth</p>
              <p className="mt-3 text-2xl font-semibold text-forest-deep">Fast, modern, and actionable.</p>
              <p className="mt-2 text-sm text-muted-foreground">The farm dashboard is optimized for quick decisions.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
