import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchReservations, fetchContactSubmissions, getSession, isAdmin } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    logger.info("[admin/index] beforeLoad: Checking admin access");
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) {
      throw redirect({ to: "/" });
    }
    const hasAdminAccess = await isAdmin(userId);
    if (!hasAdminAccess) {
      throw redirect({ to: "/" });
    }
  },
  head: () => ({
    meta: [{ title: "Admin Dashboard — Gurnam Farms" }],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const reservationsQuery = useQuery({ queryKey: ["admin", "reservations"], queryFn: fetchReservations });
  const enquiriesQuery = useQuery({ queryKey: ["admin", "enquiries"], queryFn: fetchContactSubmissions });

  const reservations = reservationsQuery.data ?? [];
  const enquiries = enquiriesQuery.data ?? [];

  const totalReservations = reservations.length;
  const totalEnquiries = enquiries.length;
  
  // Consider "New" or "Pending" as New Reservations
  const newReservations = reservations.filter(r => !r.status || r.status === "New" || r.status === "Pending").length;
  const completedReservations = reservations.filter(r => r.status === "Completed" || r.status === "Delivered").length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-forest-deep">Dashboard Summary</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/90 shadow-sm border-forest-deep/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-forest-deep">{reservationsQuery.isLoading ? "—" : totalReservations}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 shadow-sm border-forest-deep/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contact Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-forest-deep">{enquiriesQuery.isLoading ? "—" : totalEnquiries}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 shadow-sm border-forest-deep/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{reservationsQuery.isLoading ? "—" : newReservations}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 shadow-sm border-forest-deep/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">{reservationsQuery.isLoading ? "—" : completedReservations}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
