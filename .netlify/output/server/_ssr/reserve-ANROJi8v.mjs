import { r as reactExports, R as React__default, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { g as getSession, a as submitReservation } from "./router-GyR_-4HA.mjs";
import { l as logger } from "./index.mjs";
import { D as DELIVERY_AREAS, a as DELIVERY_LOCATIONS } from "./config-C8u_ZaCx.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
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
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const VEGETABLES = {
  winter: ["Cauliflower", "Carrot", "Mustard Greens", "Spinach", "Radish", "Turnip", "Peas", "Cabbage"],
  summer: ["Okra", "Bottle Gourd", "Bitter Gourd", "Ridge Gourd", "Brinjal", "Tomato", "Cucumber", "Green Chilli"]
};
function ReservePage() {
  const navigate = useNavigate();
  const [step, setStep] = reactExports.useState(1);
  const [form, setForm] = reactExports.useState({
    fullName: "",
    phone: "",
    email: "",
    deliveryArea: "",
    address: "",
    selectedVegetables: [],
    notes: ""
  });
  const [status, setStatus] = reactExports.useState("idle");
  const [message, setMessage] = reactExports.useState("");
  const [signedIn, setSignedIn] = reactExports.useState(false);
  React__default.useEffect(() => {
    void (async () => {
      try {
        const session = await getSession();
        setSignedIn(!!session?.user);
        if (session?.user?.email) {
          setForm((prev) => ({
            ...prev,
            email: session.user.email || ""
          }));
        }
      } catch (error) {
        logger.error("Session error", {
          err: String(error)
        });
      }
    })();
  }, []);
  const handleVegetableToggle = (veg) => {
    setForm((prev) => ({
      ...prev,
      selectedVegetables: prev.selectedVegetables.includes(veg) ? prev.selectedVegetables.filter((v) => v !== veg) : [...prev.selectedVegetables, veg]
    }));
  };
  const handleNext = () => {
    logger.info("handleNext called", {
      currentStep: step
    });
    if (step < 8) setStep(step + 1);
  };
  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    if (!form.deliveryArea) {
      setStatus("error");
      setMessage("Please select a delivery area.");
      return;
    }
    if (form.selectedVegetables.length === 0) {
      setStatus("error");
      setMessage("Please select at least one vegetable.");
      return;
    }
    try {
      await submitReservation({
        full_name: form.fullName.trim(),
        phone_number: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        delivery_area: form.deliveryArea,
        address: form.address.trim(),
        selected_vegetables: form.selectedVegetables,
        notes: form.notes.trim()
      });
      setStatus("success");
      setStep(8);
    } catch (error) {
      logger.error("Reservation error", {
        err: String(error)
      });
      setStatus("error");
      setMessage(error instanceof Error ? error.message : JSON.stringify(error));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-cream px-4 py-20 sm:px-6 lg:px-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-2xl", children: status === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    opacity: 0,
    y: 20
  }, animate: {
    opacity: 1,
    y: 0
  }, className: "rounded-[2rem] border border-gold/20 bg-white/90 p-8 sm:p-12 text-center shadow-xl backdrop-blur-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "🌱" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold text-forest-deep", children: "Your Harvest Awaits" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base text-muted-foreground", children: "Your weekly harvest reservation has been successfully received. We'll send you a confirmation email shortly with delivery details and a schedule for your weekly boxes." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => navigate({
      to: "/"
    }), className: "mt-8", children: "Return to Home" })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: [1, 2, 3, 4, 5, 6, 7].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-10 w-10 items-center justify-center rounded-full font-medium transition-colors ${s <= step ? "bg-gold text-forest-deep" : "border border-forest-deep/20 bg-transparent text-muted-foreground"}`, children: s }),
      s < 7 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mx-2 h-0.5 w-8 transition-colors ${s < step ? "bg-gold" : "bg-forest-deep/20"}` })
    ] }, s)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      x: 20
    }, animate: {
      opacity: 1,
      x: 0
    }, exit: {
      opacity: 0,
      x: -20
    }, className: "rounded-[2rem] border border-forest-deep/10 bg-white/90 p-8 shadow-xl backdrop-blur-sm", children: [
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-forest-deep", children: "What's your name?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", required: true, value: form.fullName, onChange: (e) => setForm({
          ...form,
          fullName: e.target.value
        }), placeholder: "Full name", className: "text-base" })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-forest-deep", children: "Phone number?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "tel", required: true, value: form.phone, onChange: (e) => setForm({
          ...form,
          phone: e.target.value
        }), placeholder: "+91 98765 43210", className: "text-base" })
      ] }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-forest-deep", children: "Email address?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", required: true, value: form.email, onChange: (e) => setForm({
          ...form,
          email: e.target.value
        }), placeholder: "you@example.com", className: "text-base" })
      ] }),
      step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-forest-deep", children: "Which city?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-2 block text-sm font-medium text-forest-deep", children: "Delivery Area" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { required: true, value: form.deliveryArea, onChange: (e) => setForm({
            ...form,
            deliveryArea: e.target.value
          }), className: "w-full rounded-full border border-cream/25 bg-cream/10 px-4 py-3 text-sm text-forest-deep outline-none transition-colors focus:border-gold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a delivery area" }),
            DELIVERY_AREAS.map((area) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: area, children: area }, area))
          ] })
        ] })
      ] }),
      step === 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-forest-deep", children: "Full delivery address?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-2 block text-sm font-medium text-forest-deep", children: "Locality" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { required: true, value: form.address || "", onChange: (e) => {
            setForm({
              ...form,
              address: e.target.value
            });
          }, className: "w-full rounded-full border border-cream/25 bg-cream/10 px-4 py-3 text-sm text-forest-deep outline-none transition-colors focus:border-gold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a locality" }),
            DELIVERY_LOCATIONS.map((loc) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: loc, children: loc }, loc))
          ] })
        ] })
      ] }),
      step === 6 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-forest-deep", children: "What would you like?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-forest-deep", children: "Winter Harvest" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: VEGETABLES.winter.map((veg) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: form.selectedVegetables.includes(veg), onChange: () => handleVegetableToggle(veg), className: "h-4 w-4 rounded border-forest-deep" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-forest-deep", children: veg })
          ] }, veg)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-forest-deep", children: "Summer Harvest" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: VEGETABLES.summer.map((veg) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: form.selectedVegetables.includes(veg), onChange: () => handleVegetableToggle(veg), className: "h-4 w-4 rounded border-forest-deep" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-forest-deep", children: veg })
          ] }, veg)) })
        ] }),
        form.selectedVegetables.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Selected: ",
          form.selectedVegetables.length,
          " item",
          form.selectedVegetables.length !== 1 ? "s" : ""
        ] })
      ] }),
      step === 7 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-forest-deep", children: "Any special requests?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: form.notes, onChange: (e) => setForm({
          ...form,
          notes: e.target.value
        }), placeholder: "Delivery preferences, allergies, or special requests...", className: "min-h-[140px]" })
      ] })
    ] }, step),
    message && status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg bg-rose-50 p-4 text-sm text-rose-600", children: message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: handlePrev, disabled: step === 1 || status === "loading", className: "flex-1", children: "Previous" }),
      step < 7 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", onClick: handleNext, disabled: status === "loading" || step === 1 && !form.fullName || step === 2 && !form.phone || step === 3 && !form.email || step === 4 && !form.deliveryArea || step === 5 && !form.address || step === 6 && form.selectedVegetables.length === 0, className: "flex-1", children: "Next" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: status === "loading", className: "flex-1", children: status === "loading" ? "Reserving..." : "Complete Reservation" })
    ] })
  ] }) }) });
}
export {
  ReservePage as component
};
