import { useState } from "react";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { signOutAdmin } from "@/lib/supabase";
import { Route as AdminLoginRoute } from "@/routes/admin/login";

export function AdminLayout() {
  const loginMatch = AdminLoginRoute.useMatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOutAdmin();
    navigate({ to: "/admin/login" });
  };

  if (loginMatch) {
    return <div className="min-h-screen bg-cream text-forest-deep"><Outlet /></div>;
  }

  return (
    <div className="min-h-screen bg-cream text-forest-deep">
      <div className="mx-auto grid max-w-7xl gap-6 py-10 px-4 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-10">
        <aside className="rounded-[2rem] border border-forest-deep/10 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
          <div className="mb-10 flex items-center gap-4 rounded-3xl bg-forest-deep/5 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-deep text-cream text-xl font-semibold">
              G
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</p>
              <p className="mt-1 text-lg font-semibold text-forest-deep">Gurnam Farms</p>
            </div>
          </div>

          <nav className="space-y-2 text-sm font-medium text-forest-deep">
            <Link to="/admin" className="block rounded-2xl px-4 py-3 transition hover:bg-forest-deep/5 hover:text-forest-deep">
              Dashboard
            </Link>
            <Link to="/admin/customers" className="block rounded-2xl px-4 py-3 transition hover:bg-forest-deep/5 hover:text-forest-deep">
              Customers
            </Link>
            <Link to="/admin/reservations" className="block rounded-2xl px-4 py-3 transition hover:bg-forest-deep/5 hover:text-forest-deep">
              Reservations
            </Link>
            <Link to="/admin/subscribers" className="block rounded-2xl px-4 py-3 transition hover:bg-forest-deep/5 hover:text-forest-deep">
              Subscribers
            </Link>
          </nav>

          <div className="mt-8">
            <Button variant="secondary" className="w-full" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? "Signing out..." : "Logout"}
            </Button>
          </div>
        </aside>

        <main className="space-y-6">
          <div className="rounded-[2rem] border border-forest-deep/10 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin panel</p>
                <h1 className="mt-2 text-3xl font-semibold text-forest-deep">Gurnam Farms Dashboard</h1>
              </div>
              <div className="rounded-full bg-forest-deep px-4 py-2 text-sm font-semibold text-cream">
                Admin Profile
              </div>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
