import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchContactSubmissions,
  updateContactSubmissionStatus,
  getSession,
  isAdmin,
} from "@/lib/supabase";
import type { ContactSubmissionRow } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { motion, AnimatePresence } from "motion/react";

export const Route = createFileRoute("/admin/enquiries")({
  beforeLoad: async () => {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) throw redirect({ to: "/" });
    const hasAdmin = await isAdmin(userId);
    if (!hasAdmin) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [{ title: "Contact Enquiries — Admin" }],
  }),
  component: AdminEnquiries,
});

const STATUS_STYLES: Record<string, string> = {
  New: "bg-blue-100 text-blue-800",
  Contacted: "bg-amber-100 text-amber-800",
  Closed: "bg-emerald-100 text-emerald-800",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700"}`}
    >
      {status}
    </span>
  );
}

function AdminEnquiries() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["admin", "enquiries"],
    queryFn: fetchContactSubmissions,
    refetchInterval: 30_000, // poll every 30 s for new enquiries
  });

  const all = (query.data ?? []) as ContactSubmissionRow[];

  // ── Analytics ────────────────────────────────────────────────────────────
  const totalNew = all.filter((e) => e.status === "New").length;
  const totalContacted = all.filter((e) => e.status === "Contacted").length;
  const totalClosed = all.filter((e) => e.status === "Closed").length;

  // ── Filters ───────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "New" | "Contacted" | "Closed">("All");
  const [dateSort, setDateSort] = useState<"newest" | "oldest">("newest");

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return all
      .filter((e) => {
        const matchesSearch =
          !term ||
          e.name.toLowerCase().includes(term) ||
          e.email.toLowerCase().includes(term) ||
          e.phone.toLowerCase().includes(term);
        const matchesStatus = statusFilter === "All" || e.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const diff =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return dateSort === "newest" ? -diff : diff;
      });
  }, [all, search, statusFilter, dateSort]);

  // ── Detail panel ─────────────────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = all.find((e) => e.id === selectedId) ?? null;
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleStatusUpdate = async (
    id: number,
    newStatus: "New" | "Contacted" | "Closed"
  ) => {
    setUpdateLoading(true);
    try {
      await updateContactSubmissionStatus(id, newStatus);
      await queryClient.invalidateQueries({ queryKey: ["admin", "enquiries"] });
    } catch (err) {
      logger.error("[admin/enquiries] status update error", { err: String(err) });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Customer Management
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-forest-deep">
            Contact Enquiries
            {totalNew > 0 && (
              <span className="ml-3 inline-flex items-center rounded-full bg-blue-600 px-2.5 py-0.5 text-sm font-bold text-white">
                {totalNew} New
              </span>
            )}
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => query.refetch()}
          disabled={query.isFetching}
        >
          {query.isFetching ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Enquiries", value: all.length, color: "text-forest-deep" },
          { label: "New", value: totalNew, color: "text-blue-700" },
          { label: "Contacted", value: totalContacted, color: "text-amber-700" },
          { label: "Closed", value: totalClosed, color: "text-emerald-700" },
        ].map(({ label, value, color }) => (
          <Card key={label} className="bg-white/90">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-4xl font-bold ${color}`}>
                {query.isLoading ? "—" : value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search name, email, phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[220px]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Closed">Closed</option>
        </select>
        <select
          value={dateSort}
          onChange={(e) => setDateSort(e.target.value as typeof dateSort)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <Button
          variant="outline"
          onClick={() => {
            setSearch("");
            setStatusFilter("All");
            setDateSort("newest");
          }}
        >
          Clear Filters
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-[2rem] border border-forest-deep/10 bg-white/90 p-6 shadow-xl">
        {query.isLoading ? (
          <div className="flex items-center gap-3 py-6 text-sm text-muted-foreground">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            Loading enquiries…
          </div>
        ) : query.isError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <p className="font-medium text-rose-900">Unable to load enquiries.</p>
            <p className="mt-1 text-sm text-rose-700">
              {query.error instanceof Error ? query.error.message : String(query.error)}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => query.refetch()}
              className="mt-3 border-rose-300 text-rose-900 hover:bg-rose-100"
            >
              Retry
            </Button>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-forest-deep/25 bg-forest-deep/5 p-10 text-center text-forest-deep">
            <p className="text-lg font-semibold">No enquiries found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Message Preview</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((enq) => (
                  <TableRow
                    key={enq.id}
                    className={selectedId === enq.id ? "bg-forest-deep/5" : ""}
                  >
                    <TableCell className="font-medium">{enq.name}</TableCell>
                    <TableCell className="text-xs">{enq.email}</TableCell>
                    <TableCell className="text-xs">{enq.phone}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                      {enq.message}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={enq.status} />
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(enq.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setSelectedId(selectedId === enq.id ? null : enq.id)
                        }
                      >
                        {selectedId === enq.id ? "Close" : "View"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                {rows.length} enquir{rows.length !== 1 ? "ies" : "y"} listed.
              </TableCaption>
            </Table>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="rounded-[2rem] border border-forest-deep/10 bg-white/90 p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-forest-deep">
                Enquiry #{selected.id}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
                ✕ Close
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Details */}
              <div className="space-y-4 rounded-2xl border border-forest-deep/10 bg-forest-deep/5 p-5">
                <h4 className="text-sm font-semibold uppercase tracking-widest text-gold">
                  Customer Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    <span className="font-medium text-forest-deep">{selected.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <a
                      href={`mailto:${selected.email}`}
                      className="font-medium text-forest-deep underline hover:text-gold"
                    >
                      {selected.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>{" "}
                    <span className="font-medium text-forest-deep">{selected.phone}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Submitted:</span>{" "}
                    <span className="font-medium text-forest-deep">
                      {new Date(selected.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Status:</span>
                    <StatusBadge status={selected.status} />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Full Message
                  </p>
                  <p className="whitespace-pre-wrap rounded-xl border border-forest-deep/10 bg-white p-4 text-sm text-forest-deep">
                    {selected.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 rounded-2xl border border-forest-deep/10 p-5">
                <h4 className="text-sm font-semibold uppercase tracking-widest text-gold">
                  Actions
                </h4>
                <p className="text-sm text-muted-foreground">
                  Update the status of this enquiry to track your follow-up.
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    className="w-full justify-start gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                    disabled={selected.status === "Contacted" || updateLoading}
                    onClick={() => handleStatusUpdate(selected.id, "Contacted")}
                  >
                    ✉️ Mark as Contacted
                  </Button>
                  <Button
                    className="w-full justify-start gap-2 bg-emerald-700 hover:bg-emerald-800 text-white"
                    disabled={selected.status === "Closed" || updateLoading}
                    onClick={() => handleStatusUpdate(selected.id, "Closed")}
                  >
                    ✓ Mark as Closed
                  </Button>
                  {selected.status !== "New" && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      disabled={updateLoading}
                      onClick={() => handleStatusUpdate(selected.id, "New")}
                    >
                      ↩ Reopen (Mark as New)
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
