import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { g as getSession, d as submitContactSubmission } from "./router-GyR_-4HA.mjs";
import { l as logger } from "./index.mjs";
import { a as DELIVERY_LOCATIONS } from "./config-C8u_ZaCx.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function ContactPage() {
  const navigate = useNavigate();
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [city, setCity] = reactExports.useState(DELIVERY_LOCATIONS[0] ?? "");
  const [message, setMessage] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("idle");
  const [feedback, setFeedback] = reactExports.useState("");
  const [signedIn, setSignedIn] = reactExports.useState(false);
  reactExports.useEffect(() => {
    void (async () => {
      const session = await getSession();
      setSignedIn(!!session?.user);
    })();
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!signedIn) {
      navigate({
        to: "/login"
      });
      return;
    }
    setStatus("loading");
    setFeedback("");
    try {
      await submitContactSubmission({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        city: city.trim(),
        message: message.trim()
      });
      setStatus("success");
      setFeedback("Thank you for reaching out. We will reply soon.");
      setName("");
      setEmail("");
      setPhone("");
      setCity("");
      setMessage("");
    } catch (error) {
      logger.error("Contact submit error", {
        err: String(error)
      });
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : JSON.stringify(error));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-cream px-4 py-20 sm:px-6 lg:px-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl rounded-[2rem] border border-forest-deep/10 bg-white/90 p-8 shadow-xl backdrop-blur-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-muted-foreground", children: "Contact us" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl font-semibold text-forest-deep", children: "Send your enquiry" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground", children: "Need help with an order or want to reserve a weekly share? Send us a message and we'll be in touch." })
    ] }),
    !signedIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700", children: [
      "Please sign in before submitting a message. ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/login", className: "font-semibold text-forest-deep underline", children: "Login" }),
      " or ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/signup", className: "font-semibold text-forest-deep underline", children: "Sign up" }),
      "."
    ] }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-2 block text-sm font-medium text-forest-deep", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: name, onChange: (event) => setName(event.target.value), required: true, placeholder: "Your full name" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-2 block text-sm font-medium text-forest-deep", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: email, onChange: (event) => setEmail(event.target.value), required: true, placeholder: "you@example.com" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-2 block text-sm font-medium text-forest-deep", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "tel", value: phone, onChange: (event) => setPhone(event.target.value), required: true, placeholder: "+91 98765 43210" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-2 block text-sm font-medium text-forest-deep", children: "Locality" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: city, onChange: (event) => setCity(event.target.value), required: true, className: "w-full rounded-full border border-cream/25 bg-cream/10 px-4 py-3 text-sm text-forest-deep outline-none transition-colors focus:border-gold", children: DELIVERY_LOCATIONS.map((loc) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: loc, children: loc }, loc)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-2 block text-sm font-medium text-forest-deep", children: "Message" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: message, onChange: (event) => setMessage(event.target.value), required: true, placeholder: "How can we help you?" })
      ] }),
      feedback ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm ${status === "error" ? "text-rose-600" : "text-forest-deep"}`, children: feedback }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: status === "loading", children: status === "loading" ? "Sending..." : "Send message" })
    ] })
  ] }) });
}
export {
  ContactPage as component
};
