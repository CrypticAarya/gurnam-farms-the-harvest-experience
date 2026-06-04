import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Reveal } from "./Reveal";

const testimonials = [
  {
    quote:
      "The quality of the produce is unmatched. It truly feels like having our own farm. The winter harvest brought back flavours I hadn't tasted since childhood.",
    name: "Aanya Mehra",
    location: "Patiala, Punjab",
    initials: "AM",
  },
  {
    quote:
      "Joining Gurnam Farms was the best decision for our health. Knowing exactly where our food comes from gives us incredible peace of mind.",
    name: "Rohan Gill",
    location: "Rajpura, Punjab",
    initials: "RG",
  },
  {
    quote:
      "Delivered before we even wake up, still cool from the morning. Everything about it feels considered and genuinely premium.",
    name: "Simran Kaur",
    location: "Chandigarh",
    initials: "SK",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const t = testimonials[index];

  const go = (dir: number) =>
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  return (
    <section className="relative overflow-hidden bg-forest py-24 text-cream md:py-36">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
        <Reveal>
          <p className="eyebrow text-gold">Loved by Families</p>
          <Quote className="mx-auto mt-8 text-gold/60" size={48} />
        </Reveal>

        <div className="relative mt-8 min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="mx-auto mt-7 max-w-3xl font-display text-2xl font-medium italic leading-snug text-cream md:text-3xl text-balance">
                "{t.quote}"
              </p>
              <div className="mt-9 flex items-center justify-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 font-display text-gold">
                  {t.initials}
                </span>
                <div className="text-left">
                  <p className="font-semibold text-cream">{t.name}</p>
                  <p className="text-sm text-cream/60">{t.location}</p>
                </div>
              </div>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            aria-label="Previous testimonial"
            onClick={() => go(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/30 text-cream transition-colors hover:border-gold hover:text-gold"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-7 bg-gold" : "w-2 bg-cream/30"
                }`}
              />
            ))}
          </div>
          <button
            aria-label="Next testimonial"
            onClick={() => go(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/30 text-cream transition-colors hover:border-gold hover:text-gold"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}