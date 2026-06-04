import { motion } from "motion/react";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { Reveal } from "./Reveal";
import cauliflower from "@/assets/col-cauliflower.jpg";
import carrots from "@/assets/col-carrots.jpg";
import greens from "@/assets/col-greens.jpg";
import tomatoes from "@/assets/col-tomatoes.jpg";
import okra from "@/assets/col-okra.jpg";
import eggplant from "@/assets/col-eggplant.jpg";

type Product = {
  name: string;
  desc: string;
  price: string;
  season: string;
  image: string;
};

const products: Product[] = [
  {
    name: "Snow Cauliflower",
    desc: "Dense, milk-white heads cut at peak tenderness.",
    price: "₹120",
    season: "Winter Harvest",
    image: cauliflower,
  },
  {
    name: "Heirloom Carrots",
    desc: "Sweet, soil-grown roots with their greens intact.",
    price: "₹90",
    season: "Winter Harvest",
    image: carrots,
  },
  {
    name: "Mustard Greens",
    desc: "Peppery leaves, pulled fresh and hand-bundled.",
    price: "₹70",
    season: "Winter Harvest",
    image: greens,
  },
  {
    name: "Vine Tomatoes",
    desc: "Sun-ripened on the vine for deep, bright flavour.",
    price: "₹110",
    season: "Summer Harvest",
    image: tomatoes,
  },
  {
    name: "Tender Okra",
    desc: "Crisp young pods, picked before they toughen.",
    price: "₹85",
    season: "Summer Harvest",
    image: okra,
  },
  {
    name: "Purple Eggplant",
    desc: "Glossy, silken-skinned and never bitter.",
    price: "₹95",
    season: "Summer Harvest",
    image: eggplant,
  },
];

function Card({ product, index }: { product: Product; index: number }) {
  const [added, setAdded] = useState(false);

  return (
    <Reveal as="div" delay={(index % 3) * 0.1}>
      <article className="group relative overflow-hidden rounded-sm border border-border bg-card">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            width={900}
            height={1100}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-forest backdrop-blur">
            Organic
          </span>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-forest-deep/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        <div className="flex items-start justify-between gap-4 p-6">
          <div>
            <p className="eyebrow text-gold">{product.season}</p>
            <h3 className="mt-2 font-display text-2xl text-forest">
              {product.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {product.desc}
            </p>
            <p className="mt-4 font-display text-xl text-forest">
              {product.price}
              <span className="ml-1 text-xs font-sans text-muted-foreground">
                / kg
              </span>
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            aria-label={`Add ${product.name} to basket`}
            onClick={() => {
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1600);
            }}
            className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
              added
                ? "bg-forest text-cream"
                : "bg-gold text-forest-deep hover:bg-forest hover:text-cream"
            }`}
          >
            {added ? <Check size={20} /> : <Plus size={20} />}
          </motion.button>
        </div>
      </article>
    </Reveal>
  );
}

export function Collections() {
  return (
    <section id="collections" className="bg-cream py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-gold">Harvest Collections</p>
          <h2 className="mt-5 font-display text-4xl font-medium leading-tight text-forest md:text-5xl lg:text-6xl text-balance">
            Picked at the Peak of the Season
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            A curated selection of what our fields are giving this week — never
            stored, never sprayed, always at its best.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Card key={p.name} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}