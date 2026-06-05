import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { X, b as Menu } from "../_libs/lucide-react.mjs";
const links = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "#story" },
  { label: "Seasonal Harvest", href: "#seasonal" },
  { label: "Delivery Areas", href: "#delivery" }
];
function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = reactExports.useState(false);
  const [open, setOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.header,
    {
      initial: { y: -80, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
      className: `fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled ? "bg-forest-deep/90 backdrop-blur-md border-b border-cream/10" : "bg-transparent"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#top", className: "flex items-baseline gap-2 text-cream", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl tracking-tight", children: "Gurnam" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "eyebrow text-gold", children: "Farms" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden items-center gap-9 lg:flex", children: links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: l.href,
              className: "text-sm font-medium text-cream/80 transition-colors hover:text-gold",
              children: l.label
            },
            l.href
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => navigate({ to: "/reserve" }),
              className: "hidden rounded-full border border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-forest-deep transition-all hover:bg-transparent hover:text-gold lg:inline-block",
              children: "Reserve Your Field"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              "aria-label": "Toggle menu",
              className: "text-cream lg:hidden",
              onClick: () => setOpen((o) => !o),
              children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 26 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { size: 26 })
            }
          )
        ] }),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            className: "overflow-hidden border-t border-cream/10 bg-forest-deep/95 px-6 py-6 lg:hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
              links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: l.href,
                  onClick: () => setOpen(false),
                  className: "text-base text-cream/85 hover:text-gold",
                  children: l.label
                },
                l.href
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    navigate({ to: "/reserve" });
                    setOpen(false);
                  },
                  className: "mt-2 rounded-full bg-gold px-6 py-3 text-center text-sm font-semibold text-forest-deep",
                  children: "Reserve Your Field"
                }
              )
            ] })
          }
        )
      ]
    }
  );
}
export {
  Navbar as N
};
