import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as getSession, c as getProfile, u as upsertProfile } from "./router-GyR_-4HA.mjs";
import { l as logger } from "./index.mjs";
import { a as DELIVERY_LOCATIONS } from "./config-C8u_ZaCx.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
function ProfilePage() {
  const [loading, setLoading] = reactExports.useState(false);
  const [profile, setProfile] = reactExports.useState(() => ({
    name: "",
    phone: "",
    city: DELIVERY_LOCATIONS[0] ?? ""
  }));
  reactExports.useState(() => {
    void (async () => {
      const session = await getSession();
      const userId = session?.user?.id;
      if (!userId) return;
      const p = await getProfile(userId);
      if (p) setProfile(p);
    })();
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await upsertProfile({
        id: profile.id,
        name: profile.name,
        phone: profile.phone,
        city: profile.city
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      logger.error("Profile upsert error", {
        err: String(err)
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-cream p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold text-forest-deep", children: "Edit Profile" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-6 max-w-md", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm text-forest-deep", children: "Name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: profile.name ?? "", onChange: (e) => setProfile((s) => ({
        ...s,
        name: e.target.value
      })) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mt-4 block text-sm text-forest-deep", children: "Phone" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: profile.phone ?? "", onChange: (e) => setProfile((s) => ({
        ...s,
        phone: e.target.value
      })) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mt-4 block text-sm text-forest-deep", children: "Locality" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: profile.city ?? DELIVERY_LOCATIONS[0], onChange: (e) => setProfile((s) => ({
        ...s,
        city: e.target.value
      })), className: "w-full rounded-full border border-cream/25 bg-cream/10 px-4 py-3 text-sm text-forest-deep outline-none transition-colors focus:border-gold", children: DELIVERY_LOCATIONS.map((loc) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: loc, children: loc }, loc)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-6", type: "submit", disabled: loading, children: loading ? "Saving..." : "Save" })
    ] })
  ] });
}
export {
  ProfilePage as component
};
