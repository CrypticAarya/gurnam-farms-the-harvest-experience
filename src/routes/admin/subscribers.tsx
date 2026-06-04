import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchNewsletterSubscribers, getSession, isAdmin } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/admin/subscribers")({
  beforeLoad: async () => {
    logger.info("[admin/subscribers] beforeLoad: Checking admin access");
    const session = await getSession();
    const userId = session?.user?.id;
    logger.info("[admin/subscribers] Session user ID", { userId });

    if (!userId) {
      logger.warn("[admin/subscribers] No userId in session, redirecting to /");
      throw redirect({ to: "/" });
    }

    const hasAdminAccess = await isAdmin(userId);
    if (!hasAdminAccess) {
      logger.warn("[admin/subscribers] User is not admin, redirecting to /");
      throw redirect({ to: "/" });
    }
    logger.info("[admin/subscribers] Admin access granted", { userId });
  },
  head: () => ({
    meta: [{ title: "Newsletter Subscribers — Admin" }],
  }),
  component: AdminSubscribers,
});

function AdminSubscribers() {
  const [search, setSearch] = useState("");
  const query = useQuery({ queryKey: ["admin", "subscribers"], queryFn: fetchNewsletterSubscribers });
  const rows = useMemo(() => {
    return (query.data ?? [])
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .filter((subscriber) => {
        const term = search.trim().toLowerCase();
        if (!term) return true;
        return subscriber.email.toLowerCase().includes(term);
      });
  }, [query.data, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Subscribers</p>
          <h2 className="mt-2 text-3xl font-semibold text-forest-deep">Newsletter subscribers</h2>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" onClick={() => setSearch("")}>Clear</Button>
        </div>
      </div>

      <div className="rounded-[2rem] border border-forest-deep/10 bg-white/90 p-6 shadow-xl">
        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading subscribers...</p>
        ) : query.isError ? (
          <p className="text-sm text-rose-600">Unable to load subscribers.</p>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-forest-deep/25 bg-forest-deep/5 p-10 text-center text-forest-deep">
            <p className="text-lg font-semibold">No subscribers yet</p>
            <p className="mt-2 text-sm text-muted-foreground">Subscriber list is currently empty.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell>{subscriber.email}</TableCell>
                  <TableCell>{new Date(subscriber.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>{rows.length} subscribers listed.</TableCaption>
          </Table>
        )}
      </div>
    </div>
  );
}
