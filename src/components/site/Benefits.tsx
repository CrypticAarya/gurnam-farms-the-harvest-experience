import { Sun, ShieldOff, HeartPulse, Recycle, Tractor, Package2 } from "lucide-react";
import { Reveal } from "./Reveal";

const benefits = [
  {
    icon: Sun,
    title: "Farm Fresh",
    desc: "Harvested the same morning it reaches you — never cold-stored.",
  },
  {
    icon: ShieldOff,
    title: "Chemical Free",
    desc: "No pesticides, no synthetic fertilisers. Ever.",
  },
  {
    icon: HeartPulse,
    title: "Nutrient Rich",
    desc: "Picked at peak ripeness for maximum vitality and flavour.",
  },
  {
    icon: Tractor,
    title: "Sustainable Farming",
    desc: "Crop rotation and natural composting renew our soil each season.",
  },
  {
    icon: Package2,
    title: "Direct From Farm",
    desc: "No middlemen, no warehouses — straight from our fields.",
  },
  {
    icon: Recycle,
    title: "Eco-Friendly Packaging",
    desc: "Fully compostable materials that return to the earth.",
  },
];

export function Benefits() {
  return (
    <section className="bg-cream bg-grain py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-gold">Why Gurnam Farms</p>
          <h2 className="mt-5 font-display text-4xl font-medium leading-tight text-forest md:text-5xl lg:text-6xl text-balance">
            A Higher Standard of Fresh
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal as="div" key={b.title} delay={(i % 3) * 0.1}>
              <div className="group h-full rounded-sm border border-border bg-card p-8 transition-colors duration-500 hover:border-gold">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest/5 text-forest transition-colors duration-500 group-hover:bg-gold group-hover:text-forest-deep">
                  <b.icon size={24} />
                </div>
                <h3 className="mt-6 font-display text-2xl text-forest">
                  {b.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {b.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}