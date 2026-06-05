import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { h as fetchDashboardCounts, i as fetchAdminMetrics, j as fetchRecentActivity } from "./router-GyR_-4HA.mjs";
import "./index.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const Card = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
function AdminDashboard() {
  const countsQuery = useQuery({
    queryKey: ["admin", "counts"],
    queryFn: fetchDashboardCounts
  });
  const metricsQuery = useQuery({
    queryKey: ["admin", "metrics"],
    queryFn: fetchAdminMetrics
  });
  const activityQuery = useQuery({
    queryKey: ["admin", "recent-activity"],
    queryFn: () => fetchRecentActivity(6)
  });
  const counts = countsQuery.data;
  const metrics = metricsQuery.data;
  const activity = activityQuery.data ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-lg font-semibold text-forest-deep", children: "Reservation Metrics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-br from-emerald-50 to-white/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Total Customers" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Unique customers with reservations" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-emerald-700", children: metricsQuery.isLoading ? "—" : metrics?.totalCustomers ?? 0 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-br from-blue-50 to-white/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Total Reservations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "All reservations submitted" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-blue-700", children: metricsQuery.isLoading ? "—" : metrics?.totalReservations ?? 0 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-br from-amber-50 to-white/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Pending" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Awaiting processing" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-amber-700", children: metricsQuery.isLoading ? "—" : metrics?.pendingReservations ?? 0 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-br from-orange-50 to-white/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Active Deliveries" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "In progress / confirmed" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-orange-700", children: metricsQuery.isLoading ? "—" : metrics?.activeDeliveries ?? 0 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-br from-green-50 to-white/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Completed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Successfully delivered" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-green-700", children: metricsQuery.isLoading ? "—" : metrics?.completedDeliveries ?? 0 }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-lg font-semibold text-forest-deep", children: "Engagement & Growth" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2 xl:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Total Contact Enquiries" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "All customer messages collected from the site." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl font-semibold text-forest-deep", children: countsQuery.isLoading ? "—" : counts?.contactCount ?? 0 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Harvest Reservations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Reservations submitted for weekly boxes." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl font-semibold text-forest-deep", children: countsQuery.isLoading ? "—" : counts?.reservationCount ?? 0 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Total Newsletter Subscribers" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "People waiting for the latest farm updates." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl font-semibold text-forest-deep", children: countsQuery.isLoading ? "—" : counts?.subscriberCount ?? 0 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Recent Activity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Latest submissions across the site." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 text-sm text-muted-foreground", children: activityQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Loading activity..." }) : activity.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No recent activity yet." }) : activity.slice(0, 5).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-slate-50 p-3 text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-forest-deep", children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: item.details }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(item.created_at).toLocaleString() })
          ] }, `${item.source}-${item.id}`)) }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Monitor enquiries, reservations, and newsletter growth from one place." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        countsQuery.isError ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-rose-600", children: "Unable to load dashboard metrics." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-forest-deep/10 bg-forest-deep/5 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.2em] text-muted-foreground", children: "Latest updates" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-2xl font-semibold text-forest-deep", children: (counts?.contactCount ?? 0) + (counts?.reservationCount ?? 0) + (counts?.subscriberCount ?? 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Total recorded customer interactions." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-forest-deep/10 bg-forest-deep/5 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.2em] text-muted-foreground", children: "Healthy growth" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-2xl font-semibold text-forest-deep", children: "Fast, modern, and actionable." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The farm dashboard is optimized for quick decisions." })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  AdminDashboard as component
};
