import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchContactSubmissions,
  getSession,
  isAdmin,
  type ContactSubmissionRow,
} from "@/lib/supabase";
import { logger } from "@/lib/logger";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/customers")({
  beforeLoad: async () => {
    logger.info("[admin/customers] beforeLoad: Checking admin access");
    const session = await getSession();
    const userId = session?.user?.id;
    logger.info("[admin/customers] Session user ID", { userId });

    if (!userId) {
      logger.warn("[admin/customers] No userId in session, redirecting to /");
      throw redirect({ to: "/" });
    }

    const hasAdminAccess = await isAdmin(userId);
    if (!hasAdminAccess) {
      logger.warn("[admin/customers] User is not admin, redirecting to /");
      throw redirect({ to: "/" });
    }
    logger.info("[admin/customers] Admin access granted", { userId });
  },
  head: () => ({
    meta: [{ title: "Customer Records — Admin" }],
  }),
  component: AdminCustomers,
});

function AdminCustomers() {
  const [search, setSearch] = useState("");
  const query = useQuery<ContactSubmissionRow[], Error>(["admin", "customers"], fetchContactSubmissions);

  const rows = useMemo(() => {
    return (query.data ?? [])
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .filter((submission) => {
        const term = search.trim().toLowerCase();
        if (!term) return true;
        return (
          submission.name.toLowerCase().includes(term) ||
          submission.email.toLowerCase().includes(term) ||
          submission.city.toLowerCase().includes(term)
        );
      });
  }, [query.data, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Customer records</p>
          <h2 className="mt-2 text-3xl font-semibold text-forest-deep">All signed-in customers</h2>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by name, email, or locality"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" onClick={() => setSearch("")}>Clear</Button>
        </div>
      </div>

      <div className="rounded-[2rem] border border-forest-deep/10 bg-white/90 p-6 shadow-xl">
        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading customer records...</p>
        ) : query.isError ? (
          <p className="text-sm text-rose-600">Unable to load customer records.</p>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-forest-deep/25 bg-forest-deep/5 p-10 text-center text-forest-deep">
            <p className="text-lg font-semibold">No customer records found</p>
            <p className="mt-2 text-sm text-muted-foreground">No contact submissions match your search.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Locality</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.name}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.phone}</TableCell>
                  <TableCell>{submission.city}</TableCell>
                  <TableCell>
                    <details className="group">
                      <summary className="cursor-pointer text-sm text-forest-deep transition hover:text-gold">View message</summary>
                      <p className="mt-2 text-sm text-muted-foreground">{submission.message}</p>
                    </details>
                  </TableCell>
                  <TableCell>{new Date(submission.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>{rows.length} customers listed.</TableCaption>
          </Table>
        )}
      </div>
    </div>
  );
}
