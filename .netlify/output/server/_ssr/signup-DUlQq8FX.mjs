import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { s as signUpCustomer } from "./router-GyR_-4HA.mjs";
import { l as logger } from "./index.mjs";
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
function CustomerSignup() {
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("idle");
  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      if (!email.trim()) {
        throw new Error("Email is required");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      await signUpCustomer({
        email: email.trim(),
        password
      });
      setStatus("success");
      setMessage("Your account has been created! Please check your email for confirmation.");
      setTimeout(() => {
        navigate({
          to: "/"
        });
      }, 1500);
    } catch (error) {
      logger.error("Signup error", {
        err: String(error)
      });
      setStatus("error");
      let errorMessage = "An error occurred during signup";
      if (error instanceof Error) {
        errorMessage = error.message;
        if (errorMessage.includes("already registered")) {
          errorMessage = "This email is already registered. Try logging in instead.";
        } else if (errorMessage.includes("invalid email")) {
          errorMessage = "Please enter a valid email address";
        } else if (errorMessage.includes("password")) {
          errorMessage = "Password must be at least 6 characters";
        }
      } else if (typeof error === "object" && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      setMessage(errorMessage);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-screen place-items-center bg-cream px-4 py-20 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-[2rem] border border-forest-deep/10 bg-white/90 p-8 shadow-xl backdrop-blur-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-muted-foreground", children: "Customer sign up" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-3xl font-semibold text-forest-deep", children: "Create your account" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-5", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-2 block text-sm font-medium text-forest-deep", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", required: true, disabled: status === "loading" || status === "success", value: email, onChange: (event) => setEmail(event.target.value), placeholder: "you@example.com" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-2 block text-sm font-medium text-forest-deep", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", required: true, disabled: status === "loading" || status === "success", value: password, onChange: (event) => setPassword(event.target.value), placeholder: "Create a password", minLength: 6 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "At least 6 characters" })
      ] }),
      message ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-lg p-3 text-sm ${status === "error" ? "border border-rose-200 bg-rose-50 text-rose-700" : status === "success" ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-forest-deep/10 bg-forest-deep/5 text-forest-deep"}`, children: message }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: status === "loading" || status === "success", children: status === "loading" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" }),
        "Creating account..."
      ] }) : status === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✓" }),
        "Account created"
      ] }) : "Sign up" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
      "Already have an account?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/login", className: "font-medium text-forest-deep hover:underline", children: "Log in" })
    ] })
  ] }) });
}
export {
  CustomerSignup as component
};
