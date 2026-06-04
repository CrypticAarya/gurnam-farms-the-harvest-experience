import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Reveal } from "./Reveal";
import ctaFarm from "@/assets/cta-farm.jpg";

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={ref}
      id="cta"
      className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-forest-deep py-28 text-center"
    >
      <motion.img
        style={{ y }}
        src={ctaFarm}
        alt="Crate of freshly harvested organic vegetables"
        width={1920}
        height={1080}
        loading="lazy"
        className="absolute inset-0 h-[124%] w-full object-cover"
      />
      <div className="absolute inset-0 bg-forest-deep/75" />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <Reveal>
          <p className="eyebrow text-gold">Limited Weekly Shares</p>
          <h2 className="mt-6 font-display text-4xl font-medium leading-[1.08] text-cream sm:text-5xl md:text-6xl lg:text-7xl text-balance">
            Reserve Your Share
            <br />
            of the <span className="italic text-gold">Harvest</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/80 md:text-lg">
            Join the waiting list for a weekly box of premium, seasonal produce —
            grown for your family, picked before dawn.
          </p>

          {done ? (
            <p className="mx-auto mt-10 max-w-md rounded-full border border-gold/40 bg-gold/10 px-6 py-4 text-cream">
              You're on the list. We'll be in touch before the next harvest. 🌱
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setDone(true);
              }}
              className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-full border border-cream/25 bg-cream/10 px-6 py-4 text-sm text-cream placeholder:text-cream/50 outline-none transition-colors focus:border-gold"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-gold px-8 py-4 text-sm font-semibold text-forest-deep transition-transform hover:scale-[1.03]"
              >
                Reserve
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}