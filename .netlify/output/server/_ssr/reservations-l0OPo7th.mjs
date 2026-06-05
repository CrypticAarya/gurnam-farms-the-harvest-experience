import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery, a as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, f as TableCaption } from "./table-VWAn32Sr.mjs";
import { o as updateReservationProgress, n as fetchReservations, e as fetchProgressByReservation } from "./router-GyR_-4HA.mjs";
import { l as logger } from "./index.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
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
function AdminReservations() {
  const [search, setSearch] = reactExports.useState("");
  const query = useQuery({
    queryKey: ["admin", "reservations"],
    queryFn: fetchReservations
  });
  const rows = reactExports.useMemo(() => {
    return (query.data ?? []).slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).filter((reservation) => {
      const term = search.trim().toLowerCase();
      if (!term) return true;
      return reservation.full_name.toLowerCase().includes(term) || reservation.email.toLowerCase().includes(term) || reservation.phone_number.toLowerCase().includes(term);
    });
  }, [query.data, search]);
  const [selected, setSelected] = reactExports.useState(null);
  const progressQuery = useQuery({
    queryKey: ["admin", "reservation", selected, "progress"],
    queryFn: () => selected ? fetchProgressByReservation(selected) : null,
    enabled: !!selected
  });
  const queryClient = useQueryClient();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-muted-foreground", children: "Farm reservations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-3xl font-semibold text-forest-deep", children: "Weekly Harvest Reservations" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by name, email, or phone", value: search, onChange: (event) => setSearch(event.target.value), className: "max-w-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setSearch(""), children: "Clear" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-[2rem] border border-forest-deep/10 bg-white/90 p-6 shadow-xl", children: query.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading reservations..." }) : query.isError ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-rose-600", children: "Unable to load reservations." }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-dashed border-forest-deep/25 bg-forest-deep/5 p-10 text-center text-forest-deep", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold", children: "No reservations yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "New weekly harvest reservations will appear here." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Full Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Delivery Area" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Delivery Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Selected Vegetables" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: rows.map((reservation) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: reservation.full_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: reservation.phone_number }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: reservation.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-gold", children: reservation.delivery_area }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-xs truncate text-xs", children: reservation.address }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          reservation.selected_vegetables.slice(0, 2).join(", "),
          " ",
          reservation.selected_vegetables.length > 2 ? `+${reservation.selected_vegetables.length - 2}` : ""
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: reservation.notes ? /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { className: "cursor-pointer text-xs text-forest-deep hover:text-gold", children: "View note" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: reservation.notes })
        ] }) : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs", children: new Date(reservation.created_at).toLocaleString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setSelected(reservation.id), children: "Manage" }) })
      ] }, reservation.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCaption, { children: [
        rows.length,
        " reservation",
        rows.length !== 1 ? "s" : "",
        " listed."
      ] })
    ] }) }) }),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[2rem] border border-forest-deep/10 bg-white/90 p-6 shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold text-forest-deep", children: [
          "Manage Progress (Reservation #",
          selected,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => {
          setSelected(null);
        }, children: "Close" }) })
      ] }),
      progressQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Loading progress..." }) : !progressQuery.data ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "No progress record found." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-1 gap-3", children: [["reservation_received", "Reservation Received"], ["farm_preparation", "Farm Preparation"], ["harvest_ready", "Harvest Ready"], ["harvested", "Harvested"], ["week_1_delivered", "Week 1 Delivered"], ["week_2_delivered", "Week 2 Delivered"], ["week_3_delivered", "Week 3 Delivered"], ["week_4_delivered", "Week 4 Delivered"], ["week_5_delivered", "Week 5 Delivered"], ["week_6_delivered", "Week 6 Delivered"], ["week_7_delivered", "Week 7 Delivered"]].map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: !!progressQuery.data[key], onChange: (e) => {
          const value = e.target.checked;
          updateReservationProgress(selected, {
            [key]: value
          }).then(() => {
            queryClient.invalidateQueries({
              queryKey: ["admin", "reservations"]
            });
            queryClient.invalidateQueries({
              queryKey: ["admin", "reservation", selected, "progress"]
            });
          }).catch((err) => logger.error("[admin/reservations] updateReservationProgress error", {
            err: String(err),
            reservationId: selected
          }));
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: label })
      ] }, String(key))) })
    ] })
  ] });
}
export {
  AdminReservations as component
};
