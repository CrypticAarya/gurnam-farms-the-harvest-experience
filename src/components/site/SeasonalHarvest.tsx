import { motion } from "motion/react";
import { Reveal } from "./Reveal";

const seasons = [
  {
    title: "Winter Harvest",
    vegetables: [
      "Cauliflower (Phool Gobi)",
      "Cabbage (Band Gobi)",
      "Iceberg Lettuce (Salad Gobi)",
      "Broccoli",
      "Carrot (Gajar)",
      "Radish (Muli)",
      "Beetroot (Chukandar)",
      "Turnip (Shalgam)",
      "Tomato",
      "Cherry Tomato",
      "Spinach (Palak)",
      "Fenugreek (Methi)",
      "Bathua",
      "Onion (Pyaz)",
      "Garlic (Lehsun)",
    ],
  },
  {
    title: "Summer Harvest",
    vegetables: [
      "Bottle Gourd (Lauki/Ghiya)",
      "Zucchini",
      "Bitter Gourd (Karela)",
      "Sponge Gourd (Tori)",
      "Round Gourd (Tinda)",
      "Summer Squash (Chappan Kaddu)",
      "Pumpkin (Petha)",
      "Lady Finger (Bhindi)",
      "Arbi",
      "Tomato",
      "Cherry Tomato",
      "Capsicum (Shimla Mirch)",
      "Bell Peppers (Red & Yellow Capsicum)",
      "Cucumber (Kheera)",
      "English Cucumber",
      "Eggplant (Baingan)",
      "Green Chilli (Hari Mirch)",
      "Beans (Lobia)",
      "Watermelon (Tarbooj)",
    ],
  },
];

export function SeasonalHarvest() {
  return (
    <section id="seasonal" className="bg-cream bg-grain py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-gold">What's Growing</p>
          <h2 className="mt-5 font-display text-4xl font-medium leading-tight text-forest md:text-5xl lg:text-6xl text-balance">
            Seasonal Harvest
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            Our weekly harvest boxes feature seasonal vegetables at their peak ripeness,
            grown without chemicals or synthetic inputs.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          {seasons.map((season, i) => (
            <Reveal key={season.title} delay={i * 0.15}>
              <div className="rounded-2xl border border-forest-deep/10 bg-white/60 p-8 backdrop-blur-sm">
                <h3 className="font-display text-2xl font-medium text-forest-deep md:text-3xl">
                  {season.title}
                </h3>
                <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {season.vegetables.map((veg) => (
                    <motion.li
                      key={veg}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center gap-3 text-sm font-medium text-forest-deep"
                    >
                      <span className="h-2 w-2 rounded-full bg-gold" />
                      {veg}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
