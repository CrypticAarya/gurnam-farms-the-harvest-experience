import { Leaf, Instagram, Facebook, Twitter, Award } from "lucide-react";

const columns = [
  {
    title: "Collections",
    links: ["Winter Harvest", "Summer Harvest", "Leafy Greens", "Seasonal Boxes"],
  },
  {
    title: "Company",
    links: ["Our Story", "The Journey", "Sustainability", "Careers"],
  },
  {
    title: "Support",
    links: ["Delivery Areas", "Contact Us", "FAQs", "Subscriptions"],
  },
];

const certifications = ["USDA Organic", "India Organic", "FSSAI Certified"];

export function Footer() {
  return (
    <footer className="bg-forest-deep text-cream">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr]">
          <div>
            <a href="#top" className="flex items-baseline gap-2">
              <span className="font-display text-3xl">Gurnam</span>
              <span className="eyebrow text-gold">Farms</span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/70">
              A premium farm-to-home experience delivering freshly harvested
              organic produce directly from our farms to your family.
            </p>

            <p className="mt-8 eyebrow text-gold">Stay in the loop</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-3 flex max-w-sm overflow-hidden rounded-full border border-cream/20"
            >
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent px-5 py-3 text-sm text-cream placeholder:text-cream/40 outline-none"
              />
              <button className="shrink-0 bg-gold px-6 text-sm font-semibold text-forest-deep">
                Join
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="eyebrow text-cream/50">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
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

        <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-4 border-y border-cream/10 py-7">
          <span className="flex items-center gap-2 text-sm text-cream/60">
            <Award size={16} className="text-gold" /> Certifications:
          </span>
          {certifications.map((c) => (
            <span
              key={c}
              className="rounded-full border border-cream/15 px-4 py-1.5 text-xs uppercase tracking-wider text-cream/70"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-5 sm:flex-row">
          <p className="flex items-center gap-2 text-xs text-cream/50">
            <Leaf size={14} className="text-gold" />© {new Date().getFullYear()}{" "}
            Gurnam Farms. Grown with care in Punjab.
          </p>
          <div className="flex gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-gold hover:text-gold"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}