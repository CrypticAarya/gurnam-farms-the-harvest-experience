import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const links = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "#story" },
  { label: "Seasonal Harvest", href: "#seasonal" },
  { label: "Delivery Areas", href: "#delivery" },
];

export function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "bg-forest-deep/90 backdrop-blur-md border-b border-cream/10"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <a href="#top" className="flex items-baseline gap-2 text-cream">
          <span className="font-display text-2xl tracking-tight">Gurnam</span>
          <span className="eyebrow text-gold">Farms</span>
        </a>

        <div className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-cream/80 transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => navigate({ to: "/reserve" })}
          className="hidden rounded-full border border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-forest-deep transition-all hover:bg-transparent hover:text-gold lg:inline-block"
        >
          Reserve Your Field
        </button>

        <button
          aria-label="Toggle menu"
          className="text-cream lg:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden border-t border-cream/10 bg-forest-deep/95 px-6 py-6 lg:hidden"
        >
          <div className="flex flex-col gap-5">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base text-cream/85 hover:text-gold"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => {
                navigate({ to: "/reserve" });
                setOpen(false);
              }}
              className="mt-2 rounded-full bg-gold px-6 py-3 text-center text-sm font-semibold text-forest-deep"
            >
              Reserve Your Field
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}