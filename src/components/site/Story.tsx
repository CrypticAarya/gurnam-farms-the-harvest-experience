import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "./Reveal";
import { useCountUp } from "./useCountUp";
import storyFarm from "@/assets/story-farm.jpg";

const stats = [
  { value: 500, suffix: "+", label: "Families Served" },
  { value: 40, suffix: "+", label: "Acres Cultivated" },
  { value: 100, suffix: "%", label: "Certified Organic" },
  { value: 2, suffix: "hr", label: "Average Delivery" },
];

function Stat({ value, suffix, label }: (typeof stats)[number]) {
  const { value: v, ref } = useCountUp(value);
  return (
    <div>
      <p className="font-display text-4xl font-medium text-forest md:text-5xl">
        <span ref={ref}>{v}</span>
        {suffix}
      </p>
      <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

export function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="story" className="relative bg-cream bg-grain py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <Reveal className="order-2 lg:order-1">
          <p className="eyebrow text-gold">Our Story</p>
          <h2 className="mt-5 font-display text-4xl font-medium leading-tight text-forest md:text-5xl lg:text-6xl text-balance">
            Rooted in Tradition.
            <br />
            <span className="italic text-gold">Grown</span> for Tomorrow.
          </h2>
          <div className="mt-7 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              For three generations, the Gurnam family has tended the same rich
              soil of Punjab — guided by a single belief: that food grown with
              patience and care tastes the way nature intended.
            </p>
            <p>
              We never sell vegetables. We deliver an experience — produce picked
              in the cool hours before sunrise, packed by hand, and carried to
              your family's table while the dew is still fresh.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-border pt-10 sm:grid-cols-4">
            {stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={0.15}>
          <div
            ref={ref}
            className="relative aspect-[4/5] overflow-hidden rounded-sm"
          >
            <motion.img
              style={{ y }}
              src={storyFarm}
              alt="Farmer holding freshly harvested organic vegetables"
              width={1080}
              height={1600}
              loading="lazy"
              className="absolute inset-0 h-[116%] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-forest/10" />
            <div className="absolute bottom-5 left-5 right-5 rounded-sm border border-cream/20 bg-forest-deep/80 px-6 py-5 backdrop-blur-sm">
              <p className="font-display text-lg italic text-cream">
                "From our hands to your home — nothing in between."
              </p>
              <p className="mt-2 eyebrow text-gold">Gurnam Singh, Founder</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}