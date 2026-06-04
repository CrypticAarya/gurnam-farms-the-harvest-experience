import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Story } from "@/components/site/Story";
import { Collections } from "@/components/site/Collections";
import { Journey } from "@/components/site/Journey";
import { Benefits } from "@/components/site/Benefits";
import { Gallery } from "@/components/site/Gallery";
import { Testimonials } from "@/components/site/Testimonials";
import { DeliveryNetwork } from "@/components/site/DeliveryNetwork";
import { FinalCTA } from "@/components/site/FinalCTA";
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
        <Collections />
        <Journey />
        <Benefits />
        <Gallery />
        <Testimonials />
        <DeliveryNetwork />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
