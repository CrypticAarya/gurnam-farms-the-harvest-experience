import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchDashboardCounts,
  fetchReservations,
  fetchContactSubmissions,
  getSession,
  isAdmin,
} from "@/lib/supabase";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    logger.info("[admin/index] beforeLoad: Checking admin access");
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) throw redirect({ to: "/" });
    const hasAdminAccess = await isAdmin(userId);
    if (!hasAdminAccess) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [{ title: "Admin Dashboard — Gurnam Farms" }],
  }),
  component: AdminDashboard,
});

// ─── helper ──────────────────────────────────────────────────────────────────

function ErrorBox({ label, error }: { label: string; error: unknown }) {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm">
      <p className="font-semibold text-rose-800">Failed to load {label}</p>
      <p className="mt-1 font-mono text-xs text-rose-600 break-all">{msg}</p>
    </div>
  );
}

// ─── component ───────────────────────────────────────────────────────────────

function AdminDashboard() {
  // Summary counts — uses proven count: "exact" queries (no column guessing)
  const countsQuery = useQuery({
    queryKey: ["admin", "dashboard-counts"],
    queryFn: fetchDashboardCounts,
    refetchInterval: 5000,
  });

  // Full rows for inline tables
  const reservationsQuery = useQuery({
    queryKey: ["admin", "reservations"],
    queryFn: fetchReservations,
    refetchInterval: 5000,
  });

  const enquiriesQuery = useQuery({
    queryKey: ["admin", "enquiries"],
    queryFn: fetchContactSubmissions,
    refetchInterval: 5000,
  });

  const counts = countsQuery.data;
  const reservations = reservationsQuery.data ?? [];
  const enquiries = enquiriesQuery.data ?? [];

  const newReservations = reservations.filter(
    (r) => !r.status || r.status === "New" || r.status === "Pending"
  ).length;
  const completedReservations = reservations.filter(
    (r) => r.status === "Completed"
  ).length;

  return (
    <div className="space-y-10">
      {/* ── Summary cards ─────────────────────────────────────────────── */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold text-forest-deep">
          Dashboard Summary
        </h2>

        {countsQuery.isError && (
          <ErrorBox label="counts" error={countsQuery.error} />
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white/90 shadow-sm border-forest-deep/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Reservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-forest-deep">
                {countsQuery.isLoading ? "—" : (counts?.reservationCount ?? 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 shadow-sm border-forest-deep/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Contact Enquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-forest-deep">
                {countsQuery.isLoading ? "—" : (counts?.contactCount ?? 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 shadow-sm border-forest-deep/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                New Reservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {reservationsQuery.isLoading ? "—" : newReservations}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 shadow-sm border-forest-deep/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Reservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">
                {reservationsQuery.isLoading ? "—" : completedReservations}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Reservations table ────────────────────────────────────────── */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-forest-deep">
          Reservations{" "}
          <span className="ml-2 text-base font-normal text-muted-foreground">
            ({reservations.length})
          </span>
        </h2>

        {reservationsQuery.isError && (
          <ErrorBox label="reservations" error={reservationsQuery.error} />
        )}

        <div className="rounded-xl border border-forest-deep/10 bg-white shadow-sm overflow-hidden">
          {reservationsQuery.isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">
              Loading reservations…
            </p>
          ) : reservations.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              No reservations yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[1100px] text-sm">
                <TableHeader className="bg-forest-deep/5">
                  <TableRow>
                    <TableHead className="w-[50px] text-center">Sr No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Delivery Area</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Selected Vegetables</TableHead>
                    <TableHead>Notes / Special Requests</TableHead>
                    <TableHead>Submitted At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((r, i) => (
                    <TableRow
                      key={r.id}
                      className="hover:bg-forest-deep/[0.02]"
                    >
                      <TableCell className="text-center text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {r.full_name}
                      </TableCell>
                      <TableCell>{r.phone_number}</TableCell>
                      <TableCell>{r.email}</TableCell>
                      <TableCell>{(r as any).delivery_area ?? "—"}</TableCell>
                      <TableCell className="text-xs">{r.address}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {r.selected_vegetables.map((v: string) => (
                            <span
                              key={v}
                              className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {r.notes || "—"}
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap">
                        {new Date(r.created_at).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* ── Contact Enquiries table ───────────────────────────────────── */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-forest-deep">
          Contact Enquiries{" "}
          <span className="ml-2 text-base font-normal text-muted-foreground">
            ({enquiries.length})
          </span>
        </h2>

        {enquiriesQuery.isError && (
          <ErrorBox label="enquiries" error={enquiriesQuery.error} />
        )}

        <div className="rounded-xl border border-forest-deep/10 bg-white shadow-sm overflow-hidden">
          {enquiriesQuery.isLoading ? (
            <p className="p-6 text-sm text-muted-foreground">
              Loading enquiries…
            </p>
          ) : enquiries.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              No enquiries yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="text-sm">
                <TableHeader className="bg-forest-deep/5">
                  <TableRow>
                    <TableHead className="w-[50px] text-center">Sr No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Submitted At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enquiries.map((e, i) => (
                    <TableRow
                      key={e.id}
                      className="hover:bg-forest-deep/[0.02]"
                    >
                      <TableCell className="text-center text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-medium">{e.name}</TableCell>
                      <TableCell>{e.phone}</TableCell>
                      <TableCell>{e.email}</TableCell>
                      <TableCell className="whitespace-pre-wrap text-xs max-w-[300px]">
                        {e.message}
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap">
                        {new Date(e.created_at).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
