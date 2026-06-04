import { Reveal } from "./Reveal";
import harvest from "@/assets/gallery-harvest.jpg";
import irrigation from "@/assets/gallery-irrigation.jpg";
import packaging from "@/assets/gallery-packaging.jpg";
import delivery from "@/assets/gallery-delivery.jpg";
import landscape from "@/assets/gallery-landscape.jpg";
import produce from "@/assets/gallery-produce.jpg";

const images = [
  { src: harvest, alt: "Farmer harvesting fresh greens at golden hour", label: "Harvesting" },
  { src: irrigation, alt: "Drip irrigation watering crop rows", label: "Irrigation" },
  { src: produce, alt: "Close-up of freshly harvested produce", label: "The Produce" },
  { src: packaging, alt: "Hands packing vegetables into eco boxes", label: "Packaging" },
  { src: landscape, alt: "Aerial view of organic farmland", label: "Our Land" },
  { src: delivery, alt: "Delivery of a produce box at a doorstep", label: "Delivery" },
];

export function Gallery() {
  return (
    <section id="gallery" className="bg-cream py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-gold">Life on the Farm</p>
          <h2 className="mt-5 font-display text-4xl font-medium leading-tight text-forest md:text-5xl lg:text-6xl text-balance">
            Every Field Tells a Story
          </h2>
        </Reveal>

        <div className="mt-16 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {images.map((img, i) => (
            <Reveal as="div" key={img.label} delay={(i % 3) * 0.08}>
              <figure className="group relative overflow-hidden rounded-sm">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-forest-deep/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <figcaption className="p-6 eyebrow text-gold">
                    {img.label}
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}