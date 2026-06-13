import { MapPin, Calendar, Truck } from "lucide-react";
import { Reveal } from "./Reveal";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { FARM_LOCATION } from "@/lib/config";

const farmInfo = [
  {
    label: "Farm Location",
    value: "Patiala, Punjab",
    icon: MapPin,
  },
  {
    label: "Harvest Schedule",
    value: "Weekly Harvests",
    icon: Calendar,
  },
  {
    label: "Delivery Area",
    value: "\u00A0",
    icon: Truck,
  },
];

export function DeliveryNetwork() {
  const navigate = useNavigate();

  return (
    <section id="delivery" className="bg-cream bg-grain py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        {/* Left Side - Content */}
        <Reveal>
          <p className="eyebrow text-gold">Our Farm</p>
          <h2 className="mt-5 font-display text-4xl font-medium leading-tight text-forest md:text-5xl lg:text-6xl text-balance">
            Visit Our Farm
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            Fresh seasonal harvests grown at our Patiala farm and delivered weekly across Patiala, Rajpura, Ambala and Chandigarh. Experience where your food comes from — sourced with care, harvested with precision.
          </p>

          {/* Farm Address */}
          <div className="mt-8 space-y-3 rounded-lg border border-gold/20 bg-gold/5 p-6">
            <p className="eyebrow text-gold">Farm Address</p>
            <p className="font-medium text-forest">
              Gurnam Farms
              <br />
              Patiala, Punjab
            </p>
          </div>

          {/* Weekly Schedule */}
          <div className="mt-6 space-y-3 rounded-lg border border-gold/20 bg-gold/5 p-6">
            <p className="eyebrow text-gold">Weekly Harvest Schedule</p>
            <p className="text-sm text-muted-foreground">
              Fresh harvests picked every week, delivered before dawn to your doorstep in Patiala.
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              className="bg-forest hover:bg-forest-deep text-cream"
            >
              <a href={FARM_LOCATION.shortUrl} target="_blank" rel="noopener noreferrer">
                Get Directions
              </a>
            </Button>
            <Button
              variant="outline"
              className="border-gold text-forest hover:bg-gold/10"
              onClick={() => navigate({ to: "/reserve" })}
            >
              Reserve Your Harvest
            </Button>
          </div>

          {/* Farm Info Cards */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            {farmInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div
                  key={info.label}
                  className="rounded-lg border border-border bg-white/50 p-4 text-center backdrop-blur"
                >
                  <Icon className="mx-auto h-5 w-5 text-gold" />
                  <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                    {info.label}
                  </p>
                  <p className="mt-1 font-semibold text-forest">{info.value}</p>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Right Side - Map */}
        <Reveal delay={0.15}>
          <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-gold/20 shadow-lg">
            {/* Google Maps Embed */}
            <iframe
              src={FARM_LOCATION.embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Gurnam Farms Location"
              className="absolute inset-0"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}