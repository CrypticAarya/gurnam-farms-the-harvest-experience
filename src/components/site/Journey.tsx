import { motion } from "motion/react";
import { Scissors, Search, Package, Truck } from "lucide-react";
import { Reveal } from "./Reveal";

const steps = [
  {
    icon: Scissors,
    title: "Harvest",
    time: "4:00 AM",
    desc: "Hand-cut in the cool dark hours, when produce is at its most nutrient-rich.",
  },
  {
    icon: Search,
    title: "Inspection",
    time: "5:30 AM",
    desc: "Every item is graded by hand. Only the finest makes it past our table.",
  },
  {
    icon: Package,
    title: "Packaging",
    time: "6:15 AM",
    desc: "Sealed in compostable, breathable packaging that keeps freshness locked in.",
  },
  {
    icon: Truck,
    title: "Delivery",
    time: "Before 8 AM",
    desc: "At your doorstep within two hours — the harvest still cool to the touch.",
  },
];

export function Journey() {
  return (
    <section
      id="journey"
      className="relative overflow-hidden bg-forest-deep py-24 text-cream md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-gold">The Harvest Journey</p>
          <h2 className="mt-5 font-display text-4xl font-medium leading-tight text-cream md:text-5xl lg:text-6xl text-balance">
            From Soil to Doorstep in Hours
          </h2>
        </Reveal>

        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-cream/15 md:block" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
            className="absolute left-0 right-0 top-7 hidden h-px bg-gold md:block"
          />

          <div className="grid gap-12 md:grid-cols-4 md:gap-6">
            {steps.map((step, i) => (
              <Reveal as="div" key={step.title} delay={i * 0.15}>
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-gold bg-forest-deep text-gold">
                    <step.icon size={22} />
                  </div>
                  <p className="mt-6 eyebrow text-gold">{step.time}</p>
                  <h3 className="mt-2 font-display text-2xl text-cream">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/70">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}