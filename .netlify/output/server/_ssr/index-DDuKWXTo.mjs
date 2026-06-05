import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as getProfile, f as fetchReservationsByProfile, e as fetchProgressByReservation } from "./router-GyR_-4HA.mjs";
import { N as Navbar } from "./Navbar-DWTZYOKE.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import "./index.mjs";
import "../_libs/tanstack__query-core.mjs";
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
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
function DashboardIndex() {
  const profileQuery = useQuery({
    queryKey: ["user", "profile"],
    queryFn: getProfile
  });
  const reservationsQuery = useQuery({
    queryKey: ["user", "reservations"],
    queryFn: fetchReservationsByProfile
  });
  const latest = reservationsQuery.data?.[0] ?? null;
  const progressQuery = useQuery({
    queryKey: ["reservations", latest?.id, "progress"],
    queryFn: () => latest ? fetchProgressByReservation(latest.id) : null,
    enabled: !!latest,
    refetchInterval: 1e4
  });
  const progressSteps = [{
    key: "reservation_received",
    label: "Reservation Received"
  }, {
    key: "farm_preparation",
    label: "Farm Preparation"
  }, {
    key: "harvest_ready",
    label: "Harvest Ready"
  }, {
    key: "harvested",
    label: "Harvested"
  }, {
    key: "week_1_delivered",
    label: "Week 1 Delivered"
  }, {
    key: "week_2_delivered",
    label: "Week 2 Delivered"
  }, {
    key: "week_3_delivered",
    label: "Week 3 Delivered"
  }, {
    key: "week_4_delivered",
    label: "Week 4 Delivered"
  }, {
    key: "week_5_delivered",
    label: "Week 5 Delivered"
  }, {
    key: "week_6_delivered",
    label: "Week 6 Delivered"
  }, {
    key: "week_7_delivered",
    label: "Week 7 Delivered"
  }];
  const completedSteps = progressQuery.data ? progressSteps.filter((step) => progressQuery.data[step.key]).length : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cream", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-4xl p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold text-forest-deep", children: "My Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-muted-foreground", children: [
        "Welcome back",
        profileQuery.data?.name ? `, ${profileQuery.data.name}` : "",
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-forest-deep", children: "Reservation Details" }),
        reservationsQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 rounded-2xl border border-forest-deep/10 bg-white/90 p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading your reservations..." })
        ] }) }) : reservationsQuery.isError ? (
          /* Error State */
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-rose-900", children: "Unable to load reservations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-rose-700", children: "There was an error retrieving your reservation data. Please try refreshing the page." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => reservationsQuery.refetch(), className: "w-fit border-rose-300 text-rose-900 hover:bg-rose-100", children: "Retry" })
          ] }) })
        ) : !latest ? (
          /* Empty State */
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 rounded-2xl border border-dashed border-forest-deep/25 bg-forest-deep/5 p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "🌱" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-forest-deep", children: "No reservations yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-sm text-sm text-muted-foreground", children: "You haven't made a weekly harvest reservation yet. Start your farm-to-home experience today!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-2", children: "Make a Reservation" })
          ] }) })
        ) : (
          /* Reservation Details */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-forest-deep/10 bg-white/90 p-6 shadow-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Reservation Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-semibold text-forest-deep", children: new Date(latest.created_at).toLocaleDateString() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-gold/10 px-3 py-2 text-sm font-medium text-gold", children: "Active" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Delivery Area" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-medium text-gold", children: latest.delivery_area })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Delivery Address" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-xs truncate text-xs font-medium", children: latest.address })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Contact" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs font-medium", children: latest.phone_number })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 border-t border-forest-deep/10 pt-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Selected Vegetables" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: latest.selected_vegetables.map((veg) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700", children: veg }, veg)) })
              ] }),
              latest.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 border-t border-forest-deep/10 pt-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Special Notes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm", children: latest.notes })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-forest-deep", children: "Harvest Progress" }),
                progressQuery.data && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "Last updated: ",
                  new Date(progressQuery.data.updated_at).toLocaleString()
                ] })
              ] }),
              progressQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-2xl border border-forest-deep/10 bg-white/90 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading progress..." })
              ] }) }) : progressQuery.isError ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-rose-700", children: "Unable to load progress. Please refresh to try again." }) }) : !progressQuery.data ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-2xl border border-dashed border-forest-deep/25 bg-forest-deep/5 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Progress tracking not available yet." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-forest-deep/10 p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-full bg-gradient-to-r from-gold to-emerald-600 px-3 py-1 text-center text-xs font-medium text-white transition-all", style: {
                  width: `${completedSteps / progressSteps.length * 100}%`
                }, children: [
                  completedSteps,
                  "/",
                  progressSteps.length
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-2", children: progressSteps.map((step, idx) => {
                  const isCompleted = progressQuery.data[step.key];
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${isCompleted ? "bg-emerald-600 text-white" : "bg-forest-deep/10 text-muted-foreground"}`, children: isCompleted ? "✓" : idx + 1 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm ${isCompleted ? "font-medium text-forest-deep" : "text-muted-foreground"}`, children: step.label })
                  ] }, step.key);
                }) })
              ] })
            ] })
          ] })
        )
      ] })
    ] })
  ] });
}
export {
  DashboardIndex as component
};
