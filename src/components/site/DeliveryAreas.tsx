import { MapPin } from "lucide-react";
import { Reveal } from "./Reveal";

const areas = [
  {
    name: "Patiala",
    description: "Our home. Fresh harvests delivered weekly.",
  },
  {
    name: "Rajpura",
    description: "Premium produce, same-day delivery available.",
  },
  {
    name: "Ambala",
    description: "Extended delivery network for quality assurance.",
  },
  {
    name: "Chandigarh",
    description: "Capital region deliveries with care.",
  },
];

export function DeliveryAreas() {
  return (
    <section className="bg-white py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="mb-16 text-center">
            <p className="eyebrow text-gold">Service Areas</p>
            <h2 className="mt-5 font-display text-4xl font-medium leading-tight text-forest md:text-5xl lg:text-6xl text-balance">
              Delivery Across Four Cities
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Fresh seasonal harvests grown at our Patiala farm and delivered weekly across Patiala, Rajpura, Ambala and Chandigarh.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {areas.map((area, index) => (
            <Reveal key={area.name} delay={index * 0.1}>
              <div className="group relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-cream/50 to-white p-8 transition-all hover:border-gold/40 hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gold/10 text-gold transition-all group-hover:bg-gold group-hover:text-white">
                    <MapPin size={20} />
                  </div>
                  
                  <h3 className="font-display text-2xl font-medium text-forest">
                    {area.name}
                  </h3>
                  
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {area.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
