import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Leaf, Sprout, Truck } from "lucide-react";
import heroFarm from "@/assets/hero-farm.jpg";

const badges = [
  { icon: Leaf, label: "100% Certified Organic" },
  { icon: Sprout, label: "Harvested at Dawn" },
  { icon: Truck, label: "2-Hour Delivery" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-forest-deep"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={heroFarm}
          alt="Organic farm at dawn with rows of fresh green crops"
          width={1920}
          height={1280}
          className="h-full w-full origin-center scale-110 animate-kenburns object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/70 via-forest-deep/40 to-forest-deep/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-transparent to-transparent" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto max-w-4xl px-6 pt-24 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="eyebrow text-gold"
        >
          Farm-to-Home · Established in Punjab
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display text-5xl font-medium leading-[1.05] tracking-tight text-cream sm:text-6xl md:text-7xl lg:text-8xl text-balance"
        >
          Farm Fresh.
          <br />
          <span className="italic text-gold">Delivered</span> Before Dawn.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg"
        >
          Premium organic produce harvested hours before it arrives at your
          doorstep.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95 }}
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#cta"
            className="w-full rounded-full bg-gold px-9 py-4 text-sm font-semibold tracking-wide text-forest-deep transition-transform hover:scale-[1.03] sm:w-auto"
          >
            Reserve Your Share
          </a>
          <a
            href="#collections"
            className="w-full rounded-full border border-cream/40 px-9 py-4 text-sm font-semibold tracking-wide text-cream transition-colors hover:border-gold hover:text-gold sm:w-auto"
          >
            Explore Collections
          </a>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mx-auto mt-14 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {badges.map((b) => (
            <li
              key={b.label}
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-cream/70"
            >
              <b.icon size={16} className="text-gold" />
              {b.label}
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-11 w-7 items-start justify-center rounded-full border border-cream/30 p-1.5">
          <span className="h-2 w-1 animate-scroll-cue rounded-full bg-gold" />
        </div>
      </motion.div>
    </section>
  );
}