import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchContactSubmissions, getSession, isAdmin } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/admin/enquiries")({
  beforeLoad: async () => {
    logger.info("[admin/enquiries] beforeLoad: Checking admin access");
    const session = await getSession();
    const userId = session?.user?.id;
    logger.info("[admin/enquiries] Session user ID", { userId });

    if (!userId) {
      logger.warn("[admin/enquiries] No userId in session, redirecting to /admin/login");
      throw redirect({ to: "/admin/login" });
    }

    const hasAdminAccess = await isAdmin(userId);
    if (!hasAdminAccess) {
      logger.warn("[admin/enquiries] User is not admin, redirecting to /");
      throw redirect({ to: "/" });
    }
    logger.info("[admin/enquiries] Admin access granted", { userId });
  },
  component: AdminEnquiries,
});

function AdminEnquiries() {
  const query = useQuery({ queryKey: ["admin", "enquiries"], queryFn: fetchContactSubmissions });
  const items = query.data ?? [];

  return (
    <div className="min-h-screen bg-cream p-6">
      <h1 className="text-2xl font-semibold text-forest-deep">All Enquiries</h1>
      <ul className="mt-4 space-y-3">
        {items.map((r: any) => (
          <li key={r.id} className="rounded-md border bg-white/90 p-4">{r.name} — {r.email} — {r.message}</li>
        ))}
      </ul>
    </div>
  );
}
