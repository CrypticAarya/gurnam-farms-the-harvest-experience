import { motion } from "motion/react";
import { MapPin, Clock } from "lucide-react";
import { Reveal } from "./Reveal";

const cities = [
  { name: "Patiala", note: "Daily · before 8 AM", x: 30, y: 38 },
  { name: "Rajpura", note: "Daily · before 9 AM", x: 55, y: 28 },
  { name: "Sirhind", note: "Mon–Sat · morning", x: 70, y: 52 },
  { name: "Chandigarh", note: "Daily · before 10 AM", x: 82, y: 34 },
  { name: "Nabha", note: "Tue–Sun · morning", x: 24, y: 64 },
  { name: "Sanaur", note: "Daily · before 8 AM", x: 46, y: 70 },
];

export function DeliveryNetwork() {
  return (
    <section id="delivery" className="bg-cream bg-grain py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <Reveal>
          <p className="eyebrow text-gold">Delivery Network</p>
          <h2 className="mt-5 font-display text-4xl font-medium leading-tight text-forest md:text-5xl lg:text-6xl text-balance">
            Fresh, Wherever You Are
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Our refrigerated morning routes reach families across the region
            within two hours of harvest. Tap a city to see its delivery window.
          </p>

          <div className="mt-9 inline-flex items-center gap-3 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5">
            <Clock size={18} className="text-gold" />
            <span className="text-sm font-medium text-forest">
              2-hour farm-to-doorstep promise
            </span>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
            {cities.map((c) => (
              <li key={c.name} className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 shrink-0 text-gold" />
                <div>
                  <p className="font-semibold text-forest">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative aspect-square overflow-hidden rounded-sm border border-border bg-forest-deep">
            <div className="absolute inset-0 bg-grain opacity-30" />
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
            >
              {cities.slice(1).map((c, i) => (
                <motion.line
                  key={c.name}
                  x1={cities[0].x}
                  y1={cities[0].y}
                  x2={c.x}
                  y2={c.y}
                  stroke="var(--gold)"
                  strokeWidth="0.4"
                  strokeDasharray="2 2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.6 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.15 }}
                />
              ))}
            </svg>
            {cities.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.12, type: "spring", stiffness: 200 }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              >
                <span className="relative flex items-center justify-center">
                  {i === 0 && (
                    <span className="absolute h-6 w-6 animate-ping rounded-full bg-gold/40" />
                  )}
                  <span
                    className={`relative block rounded-full ${
                      i === 0 ? "h-3.5 w-3.5 bg-gold" : "h-2.5 w-2.5 bg-cream"
                    }`}
                  />
                </span>
                <span className="mt-1.5 block whitespace-nowrap text-[0.6rem] font-medium uppercase tracking-wider text-cream/80">
                  {c.name}
                </span>
              </motion.div>
            ))}
            <span className="absolute bottom-4 left-4 eyebrow text-gold">
              Gurnam Farms · Hub
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}