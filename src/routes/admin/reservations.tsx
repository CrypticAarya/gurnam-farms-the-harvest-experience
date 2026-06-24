import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchReservations,
  getSession,
  isAdmin,
  updateReservationDetails,
} from "@/lib/supabase";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/admin/reservations")({
  beforeLoad: async () => {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) throw redirect({ to: "/" });
    const hasAdminAccess = await isAdmin(userId);
    if (!hasAdminAccess) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [{ title: "Reservations — Admin" }],
  }),
  component: AdminReservations,
});

const RESERVATION_STATUSES = [
  "New",
  "Contacted",
  "Confirmed",
  "Farm Ready",
  "Harvested",
  "Week 1 Delivered",
  "Week 2 Delivered",
  "Completed",
] as const;

function AdminReservations() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["admin", "reservations"],
    queryFn: fetchReservations,
    refetchInterval: 5000, // Live updates
  });

  const rows = useMemo(() => {
    return (query.data ?? [])
      .slice()
      .sort((a, b) => {
        const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return sortOrder === "newest" ? -diff : diff;
      })
      .filter((r) => {
        const term = search.trim().toLowerCase();
        const matchesSearch =
          !term ||
          r.full_name.toLowerCase().includes(term) ||
          r.email.toLowerCase().includes(term) ||
          r.phone_number.toLowerCase().includes(term) ||
          r.address.toLowerCase().includes(term);
        const currentStatus = r.status || "New";
        const matchesStatus = statusFilter === "All" || currentStatus === statusFilter;
        return matchesSearch && matchesStatus;
      });
  }, [query.data, search, statusFilter, sortOrder]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateReservationDetails(id, { status: newStatus });
      await queryClient.invalidateQueries({ queryKey: ["admin", "reservations"] });
    } catch (err) {
      logger.error("[admin/reservations] status update error", { err: String(err) });
    }
  };

  const exportCSV = () => {
    if (rows.length === 0) return;
    
    const headers = [
      "Sr. No.",
      "Name",
      "Phone Number",
      "Email Address",
      "Vegetables Selected",
      "Address",
      "Special Requests",
      "Submitted At",
      "Status"
    ];
    
    const escapeCSV = (str: string) => {
      if (str == null) return '""';
      const escaped = String(str).replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const csvRows = rows.map((r, index) => [
      index + 1,
      escapeCSV(r.full_name),
      escapeCSV(r.phone_number),
      escapeCSV(r.email),
      escapeCSV(r.selected_vegetables.join(", ")),
      escapeCSV(r.address),
      escapeCSV(r.notes ?? ""),
      escapeCSV(new Date(r.created_at).toLocaleString("en-IN")),
      escapeCSV(r.status || "New")
    ]);

    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reservations_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-forest-deep">Reservations</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[240px] bg-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background"
          >
            <option value="All">All Statuses</option>
            {RESERVATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value="Pending">Pending (legacy)</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            className="rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <Button variant="outline" onClick={exportCSV} className="bg-white">
            Export CSV
          </Button>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="rounded-xl border border-forest-deep/10 bg-white shadow-sm overflow-hidden">
        {query.isLoading ? (
          <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
            Loading reservations...
          </div>
        ) : query.isError ? (
          <div className="p-8 text-sm text-rose-600">
            Unable to load reservations.
          </div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No reservations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[1200px] text-sm">
              <TableHeader className="bg-forest-deep/5">
                <TableRow>
                  <TableHead className="w-[60px] text-center font-semibold">Sr. No.</TableHead>
                  <TableHead className="min-w-[150px] font-semibold">Name</TableHead>
                  <TableHead className="min-w-[120px] font-semibold">Phone Number</TableHead>
                  <TableHead className="min-w-[180px] font-semibold">Email Address</TableHead>
                  <TableHead className="min-w-[200px] font-semibold">Vegetables Selected</TableHead>
                  <TableHead className="min-w-[250px] font-semibold">Address</TableHead>
                  <TableHead className="min-w-[150px] font-semibold">Special Requests</TableHead>
                  <TableHead className="min-w-[140px] font-semibold">Submitted At</TableHead>
                  <TableHead className="min-w-[140px] font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, index) => (
                  <TableRow key={r.id} className="hover:bg-forest-deep/[0.02]">
                    <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                    <TableCell className="font-medium text-forest-deep">{r.full_name}</TableCell>
                    <TableCell>{r.phone_number}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {r.selected_vegetables.map(v => (
                          <span key={v} className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                            {v}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{r.address}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.notes || "—"}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString("en-IN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell>
                      <select
                        value={r.status || "New"}
                        onChange={(e) => handleStatusChange(r.id, e.target.value)}
                        className="w-full rounded border border-input bg-white px-2 py-1 text-xs"
                      >
                        {RESERVATION_STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                        {r.status === "Pending" && <option value="Pending">Pending</option>}
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
