import { Leaf, Instagram } from "lucide-react";
import { BUSINESS } from "@/lib/config";

const columns = [
  {
    title: "Support",
    links: ["Reserve", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="bg-forest-deep text-cream">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr]">
          <div>
            <a href="/" className="flex items-baseline gap-2">
              <span className="font-display text-3xl">{BUSINESS.name.split(" ")[0]}</span>
              <span className="eyebrow text-gold">{BUSINESS.name.split(" ").slice(1).join(" ")}</span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/70">
              Organic Vegetables Harvested and delivered at your door-step.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="eyebrow text-cream/50">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href={
                          link === "Reserve"
                            ? "/reserve"
                            : link === "Contact"
                            ? "/contact"
                            : `tel:${BUSINESS.phone}`
                        }
                        className="text-sm text-cream/75 transition-colors hover:text-gold"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-cream/10 pt-8 sm:flex-row">
          <p className="flex items-center gap-2 text-xs text-cream/50">
            <a href="/admin/login" aria-label="Admin Login">
              <Leaf size={14} className="text-gold hover:text-gold/80 transition-colors" />
            </a>
            © {new Date().getFullYear()}{" "}
            {BUSINESS.name}. Grown with care in {BUSINESS.address}.
          </p>
          <div className="flex gap-3">
            <a
              href={BUSINESS.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gurnam Farms on Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-gold hover:text-gold"
            >
              <Instagram size={17} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}