import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "./Reveal";
import storyFarm from "@/assets/story-farm.jpg";

const stats = [
  { value: 30, suffix: "k/Season", label: "For 200 sq.ft." },
];

function Stat({ value, suffix, label }: (typeof stats)[number]) {
  return (
    <div>
      <p className="font-display text-4xl font-medium text-forest md:text-5xl">
        {value}
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
          <p className="eyebrow text-gold">What we do</p>
          <h2 className="mt-5 font-display text-4xl font-medium leading-tight text-forest md:text-5xl lg:text-6xl text-balance">
            From Our Fields,
            <br />
            <span className="italic text-gold">Grown</span> for You.
          </h2>
          <div className="mt-7 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              At Gurnam farms, you can book a 200sq.ft. yard for your organic vegetables for summer/winter season. which will be delivered at your doorstep weekly.
            </p>
            <p>
              Winter Season: October to February (bookings open in August and September)
            </p>
            <p>Summer Season: April to August (bookings open in February and March)</p>
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
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}