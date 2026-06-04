import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchReservations, getSession, isAdmin, fetchProgressByReservation, updateReservationProgress } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/reservations")({
  beforeLoad: async () => {
    logger.info("[admin/reservations] beforeLoad: Checking admin access");
    const session = await getSession();
    const userId = session?.user?.id;
    logger.info("[admin/reservations] Session user ID", { userId });

    if (!userId) {
      logger.warn("[admin/reservations] No userId in session, redirecting to /");
      throw redirect({ to: "/" });
    }

    const hasAdminAccess = await isAdmin(userId);
    if (!hasAdminAccess) {
      logger.warn("[admin/reservations] User is not admin, redirecting to /");
      throw redirect({ to: "/" });
    }
    logger.info("[admin/reservations] Admin access granted", { userId });
  },
  head: () => ({
    meta: [{ title: "Farm Reservations — Admin" }],
  }),
  component: AdminReservations,
});

function AdminReservations() {
  const [search, setSearch] = useState("");
  const query = useQuery({ queryKey: ["admin", "reservations"], queryFn: fetchReservations });
  const rows = useMemo(() => {
    return (query.data ?? [])
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .filter((reservation) => {
        const term = search.trim().toLowerCase();
        if (!term) return true;
        return (
          reservation.full_name.toLowerCase().includes(term) ||
          reservation.email.toLowerCase().includes(term) ||
          reservation.phone_number.toLowerCase().includes(term)
        );
      });
  }, [query.data, search]);

  const [selected, setSelected] = useState<number | null>(null);
  const progressQuery = useQuery({ queryKey: ["admin", "reservation", selected, "progress"], queryFn: () => (selected ? fetchProgressByReservation(selected) : null), enabled: !!selected });
  const queryClient = useQueryClient();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Farm reservations</p>
          <h2 className="mt-2 text-3xl font-semibold text-forest-deep">Weekly Harvest Reservations</h2>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by name, email, or phone"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" onClick={() => setSearch("")}>Clear</Button>
        </div>
      </div>

      <div className="rounded-[2rem] border border-forest-deep/10 bg-white/90 p-6 shadow-xl">
        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading reservations...</p>
        ) : query.isError ? (
          <p className="text-sm text-rose-600">Unable to load reservations.</p>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-forest-deep/25 bg-forest-deep/5 p-10 text-center text-forest-deep">
            <p className="text-lg font-semibold">No reservations yet</p>
            <p className="mt-2 text-sm text-muted-foreground">New weekly harvest reservations will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Delivery Area</TableHead>
                  <TableHead>Delivery Address</TableHead>
                  <TableHead>Selected Vegetables</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.full_name}</TableCell>
                    <TableCell>{reservation.phone_number}</TableCell>
                    <TableCell>{reservation.email}</TableCell>
                    <TableCell className="font-medium text-gold">{reservation.delivery_area}</TableCell>
                    <TableCell className="max-w-xs truncate text-xs">{reservation.address}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-xs text-muted-foreground">
                          {reservation.selected_vegetables.slice(0, 2).join(", ")}{" "}
                          {reservation.selected_vegetables.length > 2 ? `+${reservation.selected_vegetables.length - 2}` : ""}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {reservation.notes ? (
                        <details className="group">
                          <summary className="cursor-pointer text-xs text-forest-deep hover:text-gold">
                            View note
                          </summary>
                          <p className="mt-2 text-xs text-muted-foreground">{reservation.notes}</p>
                        </details>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-xs">{new Date(reservation.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-xs">
                      <Button variant="ghost" onClick={() => setSelected(reservation.id)}>Manage</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>{rows.length} reservation{rows.length !== 1 ? "s" : ""} listed.</TableCaption>
            </Table>
          </div>
        )}
      </div>
      {selected && (
        <div className="rounded-[2rem] border border-forest-deep/10 bg-white/90 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-forest-deep">Manage Progress (Reservation #{selected})</h3>
            <div>
              <Button variant="ghost" onClick={() => { setSelected(null); }}>
                Close
              </Button>
            </div>
          </div>

          {progressQuery.isLoading ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading progress...</p>
          ) : !progressQuery.data ? (
            <p className="mt-4 text-sm text-muted-foreground">No progress record found.</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-3">
              {(
                [
                  ["reservation_received", "Reservation Received"],
                  ["farm_preparation", "Farm Preparation"],
                  ["harvest_ready", "Harvest Ready"],
                  ["harvested", "Harvested"],
                  ["week_1_delivered", "Week 1 Delivered"],
                  ["week_2_delivered", "Week 2 Delivered"],
                  ["week_3_delivered", "Week 3 Delivered"],
                  ["week_4_delivered", "Week 4 Delivered"],
                  ["week_5_delivered", "Week 5 Delivered"],
                  ["week_6_delivered", "Week 6 Delivered"],
                  ["week_7_delivered", "Week 7 Delivered"],
                ] as const
              ).map(([key, label]) => (
                <label key={String(key)} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!(progressQuery.data as any)[key]}
                    onChange={(e) => {
                      const value = e.target.checked;
                      updateReservationProgress(selected, { [key]: value } as any)
                        .then(() => {
                          queryClient.invalidateQueries({ queryKey: ["admin", "reservations"] });
                          queryClient.invalidateQueries({ queryKey: ["admin", "reservation", selected, "progress"] });
                        })
                        .catch((err) => logger.error("[admin/reservations] updateReservationProgress error", { err: String(err), reservationId: selected }));
                    }}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
