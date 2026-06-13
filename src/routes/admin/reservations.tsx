import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchReservations, getSession, isAdmin, updateReservationDetails } from "@/lib/supabase";
import { logger } from "@/lib/logger";

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
    meta: [{ title: "Customer Management — Admin" }],
  }),
  component: AdminReservations,
});

function AdminReservations() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  
  const query = useQuery({ queryKey: ["admin", "reservations"], queryFn: fetchReservations });
  const rows = useMemo(() => {
    return (query.data ?? [])
      .slice()
      .sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
      })
      .filter((reservation) => {
        const term = search.trim().toLowerCase();
        const matchesSearch = !term || (
          reservation.full_name.toLowerCase().includes(term) ||
          reservation.email.toLowerCase().includes(term) ||
          reservation.phone_number.toLowerCase().includes(term)
        );
        
        const currentStatus = reservation.status || "Pending";
        const matchesStatus = statusFilter === "All" || currentStatus === statusFilter;
        
        return matchesSearch && matchesStatus;
      });
  }, [query.data, search, statusFilter, sortOrder]);

  const [selected, setSelected] = useState<number | null>(null);
  const selectedReservation = query.data?.find((r) => r.id === selected);
  const queryClient = useQueryClient();

  const handleUpdateDetails = async (updates: { quantity?: number, status?: string }) => {
    if (!selected) return;
    try {
      await updateReservationDetails(selected, updates);
      queryClient.invalidateQueries({ queryKey: ["admin", "reservations"] });
    } catch (err) {
      logger.error("[admin/reservations] updateReservationDetails error", { err: String(err), reservationId: selected });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Customer Management</p>
          <h2 className="mt-2 text-3xl font-semibold text-forest-deep">Reservations</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search name, email, phone"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-[220px]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Delivered">Delivered</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <Button variant="outline" onClick={() => { setSearch(""); setStatusFilter("All"); setSortOrder("newest"); }}>Clear Filters</Button>
        </div>
      </div>

      <div className="rounded-[2rem] border border-forest-deep/10 bg-white/90 p-6 shadow-xl">
        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading reservations...</p>
        ) : query.isError ? (
          <p className="text-sm text-rose-600">Unable to load reservations.</p>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-forest-deep/25 bg-forest-deep/5 p-10 text-center text-forest-deep">
            <p className="text-lg font-semibold">No reservations found</p>
            <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Reserved Vegetables</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reservation Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.full_name}</TableCell>
                    <TableCell className="text-xs">{reservation.email}</TableCell>
                    <TableCell className="text-xs">{reservation.phone_number}</TableCell>
                    <TableCell className="max-w-xs truncate text-xs" title={reservation.address}>{reservation.address}</TableCell>
                    <TableCell>
                      <div className="max-w-[150px] truncate text-xs text-muted-foreground" title={reservation.selected_vegetables.join(", ")}>
                        {reservation.selected_vegetables.join(", ")}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{reservation.quantity ?? 1}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        (reservation.status || 'Pending') === 'Confirmed' ? 'bg-orange-100 text-orange-800' : 
                        (reservation.status || 'Pending') === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {reservation.status || 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">{new Date(reservation.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-xs">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(reservation.id)}>Manage</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>{rows.length} reservation{rows.length !== 1 ? "s" : ""} listed.</TableCaption>
            </Table>
          </div>
        )}
      </div>
      {selected && selectedReservation && (
        <div className="rounded-[2rem] border border-forest-deep/10 bg-white/90 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-forest-deep">Manage Reservation #{selected}</h3>
            <div>
              <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4 rounded-xl border border-forest-deep/10 p-4">
              <h4 className="font-medium text-forest-deep">Update Order</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-forest-deep">Quantity (Boxes)</label>
                <Input 
                  type="number" 
                  min="1" 
                  value={selectedReservation.quantity ?? 1} 
                  onChange={(e) => handleUpdateDetails({ quantity: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-forest-deep">Fulfillment Status</label>
                <select
                  value={selectedReservation.status || 'Pending'}
                  onChange={(e) => handleUpdateDetails({ status: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-forest-deep/10 p-4 bg-forest-deep/5">
              <h4 className="font-medium text-forest-deep">Customer Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> {selectedReservation.full_name}</p>
                <p><span className="text-muted-foreground">Email:</span> {selectedReservation.email}</p>
                <p><span className="text-muted-foreground">Phone:</span> {selectedReservation.phone_number}</p>
                <p><span className="text-muted-foreground">Address:</span> {selectedReservation.address}</p>
                {selectedReservation.notes && (
                  <p><span className="text-muted-foreground">Notes:</span> {selectedReservation.notes}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
