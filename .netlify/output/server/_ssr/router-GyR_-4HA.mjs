import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as redirect } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { l as logger } from "./index.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-BkW_cqDj.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function initSentryClient() {
  {
    console.warn(
      "[Sentry] Client DSN not configured. Error tracking disabled. Set VITE_SENTRY_DSN env var to enable."
    );
    return;
  }
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  logger.error("Root route error", { err: String(error) });
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$g = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Gurnam Farms — Farm Fresh, Delivered Before Dawn" },
      {
        name: "description",
        content: "Premium organic produce harvested hours before it arrives at your doorstep. A farm-to-home experience from Gurnam Farms."
      },
      { name: "author", content: "Gurnam Farms" },
      { name: "theme-color", content: "#163A24" },
      { property: "og:title", content: "Gurnam Farms — Farm Fresh, Delivered Before Dawn" },
      {
        property: "og:description",
        content: "Premium organic produce harvested hours before it arrives at your doorstep."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..700&family=Inter:wght@300..700&display=swap"
      },
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$g.useRouteContext();
  reactExports.useEffect(() => {
    initSentryClient();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const BASE_URL = "";
const Route$f = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" }
        ];
        const urls = entries.map(
          (e) => [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`
          ].filter(Boolean).join("\n")
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600"
          }
        });
      }
    }
  }
});
const $$splitComponentImporter$e = () => import("./signup-DUlQq8FX.mjs");
const Route$e = createFileRoute("/signup")({
  head: () => ({
    meta: [{
      title: "Customer Sign Up — Gurnam Farms"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./reserve-ANROJi8v.mjs");
const Route$d = createFileRoute("/reserve")({
  head: () => ({
    meta: [{
      title: "Reserve Your Field — Gurnam Farms"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./login-DAv9cWfR.mjs");
const Route$c = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Customer Login — Gurnam Farms"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./contact-Dao5bMN0.mjs");
const Route$b = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact Us — Gurnam Farms"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./index-r3EzVxrR.mjs");
const Route$a = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Gurnam Farms — Farm Fresh, Delivered Before Dawn"
    }, {
      name: "description",
      content: "Premium organic produce harvested hours before it arrives at your doorstep. A luxury farm-to-home experience from Gurnam Farms, Punjab."
    }, {
      property: "og:title",
      content: "Gurnam Farms — Farm Fresh, Delivered Before Dawn"
    }, {
      property: "og:description",
      content: "Premium organic produce harvested hours before it arrives at your doorstep."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const supabaseUrl = "https://your-project-id.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwd3B1emx4YWNpbGpveG1reG1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MDUwNjksImV4cCI6MjA5NjA4MTA2OX0.cRvfjZIbUOGIHFGOt5JhJzH9w3q3qbl4_TZPTicC0JA";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
function formatSupabaseError(err) {
  try {
    if (!err) return "Unknown Supabase error";
    const parts = [];
    if (err.message) parts.push(err.message);
    if (err.details) parts.push(String(err.details));
    if (err.hint) parts.push(String(err.hint));
    if (err.code) parts.push(`code=${err.code}`);
    return parts.join(" — ");
  } catch (e) {
    return String(err);
  }
}
function throwSupabaseError(err) {
  const msg = formatSupabaseError(err);
  logger.error("Supabase Error", { error: msg });
  throw new Error(msg);
}
async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throwSupabaseError(error);
  return data.session;
}
async function isAdmin(userId) {
  try {
    logger.info("[isAdmin] Checking admin status", { userId });
    const profile = await getProfile(userId);
    const isAdminUser = profile?.role === "admin";
    logger.info("[isAdmin] Admin check result", {
      userId,
      profileExists: !!profile,
      role: profile?.role,
      isAdmin: isAdminUser
    });
    return isAdminUser;
  } catch (error) {
    logger.error("[isAdmin] Error checking admin status", { err: String(error) });
    return false;
  }
}
async function upsertProfile(profile) {
  const { data, error } = await supabase.from("profiles").upsert(profile).select().maybeSingle();
  if (error) throwSupabaseError(error);
  return data;
}
async function getProfile(userId) {
  if (!userId) {
    const user = await supabase.auth.getUser();
    userId = user.data.user?.id ?? void 0;
  }
  if (!userId) {
    logger.warn("[getProfile] No userId provided or found");
    return null;
  }
  logger.info("[getProfile] Fetching profile", { userId });
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) {
    logger.error("[getProfile] Error fetching profile", { err: formatSupabaseError(error) });
    throwSupabaseError(error);
  }
  logger.info("[getProfile] Profile fetched", {
    id: data?.id,
    role: data?.role,
    exists: !!data
  });
  return data ?? null;
}
async function signUpCustomer({
  email,
  password
}) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    throwSupabaseError(error);
  }
}
async function signInCustomer({
  email,
  password
}) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throwSupabaseError(error);
}
async function signInAdmin({
  email,
  password
}) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throwSupabaseError(error);
}
async function getCurrentUserId() {
  const u = await supabase.auth.getUser();
  if (u.error) throwSupabaseError(u.error);
  return u.data.user?.id ?? null;
}
async function submitContactSubmission(submission) {
  const profileId = await getCurrentUserId();
  const payload = { ...submission, profile_id: profileId };
  const { data, error } = await supabase.from("contact_submissions").insert(payload).select();
  if (error) throwSupabaseError(error);
  return data;
}
async function submitReservation(reservation) {
  const profileId = await getCurrentUserId();
  const payload = { ...reservation, profile_id: profileId };
  const { data, error } = await supabase.from("reservations").insert(payload).select();
  if (error) throwSupabaseError(error);
  const inserted = data?.[0];
  if (inserted) {
    try {
      await createProgressForReservation(inserted.id);
    } catch (e) {
      logger.warn("[submitReservation] createProgressForReservation failed", { err: String(e) });
    }
    try {
      const { sendReservationConfirmationEmail } = await import("./email.functions-iCVARtTh.mjs");
      const result = await sendReservationConfirmationEmail({
        data: {
          full_name: reservation.full_name,
          email: reservation.email,
          delivery_area: reservation.delivery_area,
          address: reservation.address,
          selected_vegetables: reservation.selected_vegetables
        }
      });
      if (!result.ok) {
        logger.warn("[submitReservation] Email send failed", { message: result.message });
      } else {
        logger.info("[submitReservation] Confirmation email queued", { id: result.id });
      }
    } catch (e) {
      logger.warn("[submitReservation] Email function error", { err: String(e) });
    }
  }
  return data;
}
async function fetchReservations() {
  const { data, error } = await supabase.from("reservations").select("*").order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return data ?? [];
}
async function fetchContactSubmissions() {
  const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return data ?? [];
}
async function fetchNewsletterSubscribers() {
  const { data, error } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return data ?? [];
}
async function fetchDashboardCounts() {
  const contacts = await supabase.from("contact_submissions").select("id", { count: "exact", head: true });
  const reservations = await supabase.from("reservations").select("id", { count: "exact", head: true });
  const subscribers = await supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true });
  if (contacts.error || reservations.error || subscribers.error) {
    throwSupabaseError(contacts.error ?? reservations.error ?? subscribers.error);
  }
  return {
    contactCount: contacts.count ?? 0,
    reservationCount: reservations.count ?? 0,
    subscriberCount: subscribers.count ?? 0
  };
}
async function fetchAdminMetrics() {
  try {
    const customers = await supabase.from("reservations").select("profile_id", { count: "exact", head: true }).not("profile_id", "is", null);
    const allReservations = await supabase.from("reservations").select("id, status", { count: "exact", head: false });
    const reservationsByStatus = allReservations.data?.reduce((acc, res) => {
      acc[res.status] = (acc[res.status] ?? 0) + 1;
      return acc;
    }, {}) ?? {};
    if (customers.error || allReservations.error) {
      throwSupabaseError(customers.error ?? allReservations.error);
    }
    return {
      totalCustomers: customers.count ?? 0,
      totalReservations: allReservations.count ?? 0,
      activeDeliveries: (reservationsByStatus["confirmed"] ?? 0) + (reservationsByStatus["pending"] ?? 0),
      completedDeliveries: reservationsByStatus["completed"] ?? 0,
      pendingReservations: reservationsByStatus["pending"] ?? 0
    };
  } catch (err) {
    logger.error("fetchAdminMetrics failed", { err: String(err) });
    return {
      totalCustomers: 0,
      totalReservations: 0,
      activeDeliveries: 0,
      completedDeliveries: 0,
      pendingReservations: 0
    };
  }
}
async function fetchRecentActivity(limit = 6) {
  const [contacts, reservations, subscribers] = await Promise.all([
    fetchContactSubmissions(),
    fetchReservations(),
    fetchNewsletterSubscribers()
  ]);
  const activity = [
    ...contacts.map((item) => ({
      id: item.id,
      source: "contact",
      title: item.name,
      email: item.email,
      details: item.message,
      created_at: item.created_at
    })),
    ...reservations.map((item) => ({
      id: item.id,
      source: "reservation",
      title: item.full_name,
      email: item.email,
      details: `${item.delivery_area} — ${item.address}`,
      created_at: item.created_at
    })),
    ...subscribers.map((item) => ({
      id: item.id,
      source: "subscriber",
      title: item.email,
      email: item.email,
      details: "Newsletter signup",
      created_at: item.created_at
    }))
  ];
  return activity.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, limit);
}
async function fetchUserReservations(userId) {
  if (!userId) userId = await getCurrentUserId();
  if (!userId) return [];
  const { data, error } = await supabase.from("reservations").select("*").eq("profile_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
async function fetchUserEnquiries(userId) {
  if (!userId) userId = await getCurrentUserId();
  if (!userId) return [];
  const { data, error } = await supabase.from("contact_submissions").select("*").eq("profile_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
async function fetchReservationsByProfile(userId) {
  if (!userId) userId = await getCurrentUserId();
  if (!userId) return [];
  const { data, error } = await supabase.from("reservations").select("*").eq("profile_id", userId).order("created_at", { ascending: false });
  if (error) throwSupabaseError(error);
  return data ?? [];
}
async function createProgressForReservation(reservationId) {
  const { data, error } = await supabase.from("reservation_progress").insert({ reservation_id: reservationId, reservation_received: true }).select().maybeSingle();
  if (error) {
    logger.warn("[createProgressForReservation] error creating progress", { err: formatSupabaseError(error) });
    return null;
  }
  return data ?? null;
}
async function fetchProgressByReservation(reservationId) {
  const { data, error } = await supabase.from("reservation_progress").select("*").eq("reservation_id", reservationId).maybeSingle();
  if (error) throwSupabaseError(error);
  return data ?? null;
}
async function updateReservationProgress(reservationId, updates) {
  const payload = { ...updates, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
  const { data, error } = await supabase.from("reservation_progress").update(payload).eq("reservation_id", reservationId).select().maybeSingle();
  if (error) throwSupabaseError(error);
  return data ?? null;
}
const $$splitComponentImporter$9 = () => import("./index-DDuKWXTo.mjs");
const Route$9 = createFileRoute("/dashboard/")({
  beforeLoad: async () => {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) throw redirect({
      to: "/login"
    });
    const profile = await getProfile(userId);
    if (!profile || profile.role !== "customer") throw redirect({
      to: "/"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./index-CLUTrODu.mjs");
const Route$8 = createFileRoute("/admin/")({
  beforeLoad: async () => {
    logger.info("[admin/index] beforeLoad: Checking admin access");
    const session = await getSession();
    const userId = session?.user?.id;
    logger.info("[admin/index] Session user ID", {
      userId
    });
    if (!userId) {
      logger.warn("[admin/index] No userId in session, redirecting to /");
      throw redirect({
        to: "/"
      });
    }
    const hasAdminAccess = await isAdmin(userId);
    if (!hasAdminAccess) {
      logger.warn("[admin/index] User is not admin, redirecting to /");
      throw redirect({
        to: "/"
      });
    }
    logger.info("[admin/index] Admin access granted", {
      userId
    });
  },
  head: () => ({
    meta: [{
      title: "Admin Dashboard — Gurnam Farms"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./reservations-Co7gI_JX.mjs");
const Route$7 = createFileRoute("/dashboard/reservations")({
  beforeLoad: async () => {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) throw redirect({
      to: "/login"
    });
    const profile = await getProfile(userId);
    if (!profile || profile.role !== "customer") throw redirect({
      to: "/"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./profile-Co_XB3Jp.mjs");
const Route$6 = createFileRoute("/dashboard/profile")({
  beforeLoad: async () => {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) throw redirect({
      to: "/login"
    });
    const profile = await getProfile(userId);
    if (!profile || profile.role !== "customer") throw redirect({
      to: "/"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./enquiries-BjCzYKjA.mjs");
const Route$5 = createFileRoute("/dashboard/enquiries")({
  beforeLoad: async () => {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) throw redirect({
      to: "/login"
    });
    const profile = await getProfile(userId);
    if (!profile || profile.role !== "customer") throw redirect({
      to: "/"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./subscribers-Bxw_OKF_.mjs");
const Route$4 = createFileRoute("/admin/subscribers")({
  beforeLoad: async () => {
    logger.info("[admin/subscribers] beforeLoad: Checking admin access");
    const session = await getSession();
    const userId = session?.user?.id;
    logger.info("[admin/subscribers] Session user ID", {
      userId
    });
    if (!userId) {
      logger.warn("[admin/subscribers] No userId in session, redirecting to /");
      throw redirect({
        to: "/"
      });
    }
    const hasAdminAccess = await isAdmin(userId);
    if (!hasAdminAccess) {
      logger.warn("[admin/subscribers] User is not admin, redirecting to /");
      throw redirect({
        to: "/"
      });
    }
    logger.info("[admin/subscribers] Admin access granted", {
      userId
    });
  },
  head: () => ({
    meta: [{
      title: "Newsletter Subscribers — Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./reservations-l0OPo7th.mjs");
const Route$3 = createFileRoute("/admin/reservations")({
  beforeLoad: async () => {
    logger.info("[admin/reservations] beforeLoad: Checking admin access");
    const session = await getSession();
    const userId = session?.user?.id;
    logger.info("[admin/reservations] Session user ID", {
      userId
    });
    if (!userId) {
      logger.warn("[admin/reservations] No userId in session, redirecting to /");
      throw redirect({
        to: "/"
      });
    }
    const hasAdminAccess = await isAdmin(userId);
    if (!hasAdminAccess) {
      logger.warn("[admin/reservations] User is not admin, redirecting to /");
      throw redirect({
        to: "/"
      });
    }
    logger.info("[admin/reservations] Admin access granted", {
      userId
    });
  },
  head: () => ({
    meta: [{
      title: "Farm Reservations — Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./login-B1FJqwdG.mjs");
const Route$2 = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{
      title: "Admin Login — Gurnam Farms"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./enquiries-C94AB9A1.mjs");
const Route$1 = createFileRoute("/admin/enquiries")({
  beforeLoad: async () => {
    logger.info("[admin/enquiries] beforeLoad: Checking admin access");
    const session = await getSession();
    const userId = session?.user?.id;
    logger.info("[admin/enquiries] Session user ID", {
      userId
    });
    if (!userId) {
      logger.warn("[admin/enquiries] No userId in session, redirecting to /admin/login");
      throw redirect({
        to: "/admin/login"
      });
    }
    const hasAdminAccess = await isAdmin(userId);
    if (!hasAdminAccess) {
      logger.warn("[admin/enquiries] User is not admin, redirecting to /");
      throw redirect({
        to: "/"
      });
    }
    logger.info("[admin/enquiries] Admin access granted", {
      userId
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./customers-D2VC7BIX.mjs");
const Route = createFileRoute("/admin/customers")({
  beforeLoad: async () => {
    logger.info("[admin/customers] beforeLoad: Checking admin access");
    const session = await getSession();
    const userId = session?.user?.id;
    logger.info("[admin/customers] Session user ID", {
      userId
    });
    if (!userId) {
      logger.warn("[admin/customers] No userId in session, redirecting to /");
      throw redirect({
        to: "/"
      });
    }
    const hasAdminAccess = await isAdmin(userId);
    if (!hasAdminAccess) {
      logger.warn("[admin/customers] User is not admin, redirecting to /");
      throw redirect({
        to: "/"
      });
    }
    logger.info("[admin/customers] Admin access granted", {
      userId
    });
  },
  head: () => ({
    meta: [{
      title: "Customer Records — Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SitemapDotxmlRoute = Route$f.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$g
});
const SignupRoute = Route$e.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$g
});
const ReserveRoute = Route$d.update({
  id: "/reserve",
  path: "/reserve",
  getParentRoute: () => Route$g
});
const LoginRoute = Route$c.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$g
});
const ContactRoute = Route$b.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$g
});
const IndexRoute = Route$a.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$g
});
const DashboardIndexRoute = Route$9.update({
  id: "/dashboard/",
  path: "/dashboard/",
  getParentRoute: () => Route$g
});
const AdminIndexRoute = Route$8.update({
  id: "/admin/",
  path: "/admin/",
  getParentRoute: () => Route$g
});
const DashboardReservationsRoute = Route$7.update({
  id: "/dashboard/reservations",
  path: "/dashboard/reservations",
  getParentRoute: () => Route$g
});
const DashboardProfileRoute = Route$6.update({
  id: "/dashboard/profile",
  path: "/dashboard/profile",
  getParentRoute: () => Route$g
});
const DashboardEnquiriesRoute = Route$5.update({
  id: "/dashboard/enquiries",
  path: "/dashboard/enquiries",
  getParentRoute: () => Route$g
});
const AdminSubscribersRoute = Route$4.update({
  id: "/admin/subscribers",
  path: "/admin/subscribers",
  getParentRoute: () => Route$g
});
const AdminReservationsRoute = Route$3.update({
  id: "/admin/reservations",
  path: "/admin/reservations",
  getParentRoute: () => Route$g
});
const AdminLoginRoute = Route$2.update({
  id: "/admin/login",
  path: "/admin/login",
  getParentRoute: () => Route$g
});
const AdminEnquiriesRoute = Route$1.update({
  id: "/admin/enquiries",
  path: "/admin/enquiries",
  getParentRoute: () => Route$g
});
const AdminCustomersRoute = Route.update({
  id: "/admin/customers",
  path: "/admin/customers",
  getParentRoute: () => Route$g
});
const rootRouteChildren = {
  IndexRoute,
  ContactRoute,
  LoginRoute,
  ReserveRoute,
  SignupRoute,
  SitemapDotxmlRoute,
  AdminCustomersRoute,
  AdminEnquiriesRoute,
  AdminLoginRoute,
  AdminReservationsRoute,
  AdminSubscribersRoute,
  DashboardEnquiriesRoute,
  DashboardProfileRoute,
  DashboardReservationsRoute,
  AdminIndexRoute,
  DashboardIndexRoute
};
const routeTree = Route$g._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  submitReservation as a,
  signInCustomer as b,
  getProfile as c,
  submitContactSubmission as d,
  fetchProgressByReservation as e,
  fetchReservationsByProfile as f,
  getSession as g,
  fetchDashboardCounts as h,
  fetchAdminMetrics as i,
  fetchRecentActivity as j,
  fetchUserReservations as k,
  fetchUserEnquiries as l,
  fetchNewsletterSubscribers as m,
  fetchReservations as n,
  updateReservationProgress as o,
  signInAdmin as p,
  fetchContactSubmissions as q,
  router as r,
  signUpCustomer as s,
  upsertProfile as u
};
