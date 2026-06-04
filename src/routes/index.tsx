import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Story } from "@/components/site/Story";
import { SeasonalHarvest } from "@/components/site/SeasonalHarvest";
import { DeliveryAreas } from "@/components/site/DeliveryAreas";
import { DeliveryNetwork } from "@/components/site/DeliveryNetwork";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gurnam Farms — Farm Fresh, Delivered Before Dawn" },
      {
        name: "description",
        content:
          "Premium organic produce harvested hours before it arrives at your doorstep. A luxury farm-to-home experience from Gurnam Farms, Punjab.",
      },
      { property: "og:title", content: "Gurnam Farms — Farm Fresh, Delivered Before Dawn" },
      {
        property: "og:description",
        content:
          "Premium organic produce harvested hours before it arrives at your doorstep.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <Hero />
        <Story />
        <SeasonalHarvest />
        <DeliveryAreas />
        <DeliveryNetwork />
      </main>
      <Footer />
    </div>
  );
}
