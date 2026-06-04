import React, { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getSession, submitReservation } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { DELIVERY_AREAS, DELIVERY_LOCATIONS } from "@/lib/config";
import { motion } from "motion/react";

const VEGETABLES = {
  winter: ["Cauliflower", "Carrot", "Mustard Greens", "Spinach", "Radish", "Turnip", "Peas", "Cabbage"],
  summer: ["Okra", "Bottle Gourd", "Bitter Gourd", "Ridge Gourd", "Brinjal", "Tomato", "Cucumber", "Green Chilli"],
};

export const Route = createFileRoute("/reserve")({
  head: () => ({
    meta: [{ title: "Reserve Your Field — Gurnam Farms" }],
  }),
  component: ReservePage,
});

function ReservePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    deliveryArea: "",
    address: "",
    selectedVegetables: [] as string[],
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [signedIn, setSignedIn] = useState(false);

  React.useEffect(() => {
    void (async () => {
      try {
        const session = await getSession();
        setSignedIn(!!session?.user);
        if (session?.user?.email) {
          setForm((prev) => ({ ...prev, email: session.user.email || "" }));
        }
      } catch (error) {
        logger.error("Session error", { err: String(error) });
      }
    })();
  }, []);

  const handleVegetableToggle = (veg: string) => {
    setForm((prev) => ({
      ...prev,
      selectedVegetables: prev.selectedVegetables.includes(veg)
        ? prev.selectedVegetables.filter((v) => v !== veg)
        : [...prev.selectedVegetables, veg],
    }));
  };

  const handleNext = () => {
    logger.info("handleNext called", { currentStep: step });
    if (step < 8) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const validateStep = (currentStep: number): boolean => {
    const validation = {
      1: !!form.fullName,
      2: !!form.phone,
      3: !!form.email,
      4: !!form.deliveryArea, // Check delivery area at Step 4
      5: !!form.address, // Check address at Step 5
      6: form.selectedVegetables.length > 0, // Check vegetables at Step 6
      7: true, // Notes are optional
    };
    const isValid = validation[currentStep as keyof typeof validation] ?? true;
    return isValid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!form.deliveryArea) {
      setStatus("error");
      setMessage("Please select a delivery area.");
      return;
    }

    if (form.selectedVegetables.length === 0) {
      setStatus("error");
      setMessage("Please select at least one vegetable.");
      return;
    }

    try {
      await submitReservation({
        full_name: form.fullName.trim(),
        phone_number: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        delivery_area: form.deliveryArea,
        address: form.address.trim(),
        selected_vegetables: form.selectedVegetables,
        notes: form.notes.trim(),
      });
      setStatus("success");
      setStep(8);
    } catch (error) {
      logger.error("Reservation error", { err: String(error) });
      setStatus("error");
      setMessage(error instanceof Error ? error.message : JSON.stringify(error));
    }
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl">
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-gold/20 bg-white/90 p-8 sm:p-12 text-center shadow-xl backdrop-blur-sm"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
              <span className="text-3xl">🌱</span>
            </div>
            <h1 className="text-3xl font-semibold text-forest-deep">Your Harvest Awaits</h1>
            <p className="mt-4 text-base text-muted-foreground">
              Your weekly harvest reservation has been successfully received. We'll send you a confirmation email shortly with delivery details and a schedule for your weekly boxes.
            </p>
            <Button
              onClick={() => navigate({ to: "/" })}
              className="mt-8"
            >
              Return to Home
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-medium transition-colors ${
                      s <= step
                        ? "bg-gold text-forest-deep"
                        : "border border-forest-deep/20 bg-transparent text-muted-foreground"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 7 && (
                    <div
                      className={`mx-2 h-0.5 w-8 transition-colors ${
                        s < step ? "bg-gold" : "bg-forest-deep/20"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Form Content */}
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-[2rem] border border-forest-deep/10 bg-white/90 p-8 shadow-xl backdrop-blur-sm"
            >
              {/* Step 1: Full Name */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-forest-deep">What's your name?</h2>
                  <Input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Full name"
                    className="text-base"
                  />
                </div>
              )}

              {/* Step 2: Phone */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-forest-deep">Phone number?</h2>
                  <Input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="text-base"
                  />
                </div>
              )}

              {/* Step 3: Email */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-forest-deep">Email address?</h2>
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="text-base"
                  />
                </div>
              )}

              {/* Step 4: Delivery Area */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-forest-deep">Which city?</h2>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-forest-deep">Delivery Area</label>
                    <select
                      required
                      value={form.deliveryArea}
                      onChange={(e) => setForm({ ...form, deliveryArea: e.target.value })}
                      className="w-full rounded-full border border-cream/25 bg-cream/10 px-4 py-3 text-sm text-forest-deep outline-none transition-colors focus:border-gold"
                    >
                      <option value="">Select a delivery area</option>
                      {DELIVERY_AREAS.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 5: Delivery Address */}
              {step === 5 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-forest-deep">Full delivery address?</h2>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-forest-deep">Locality</label>
                    <select
                      required
                      value={form.address || ""}
                      onChange={(e) => {
                        setForm({ ...form, address: e.target.value });
                      }}
                      className="w-full rounded-full border border-cream/25 bg-cream/10 px-4 py-3 text-sm text-forest-deep outline-none transition-colors focus:border-gold"
                    >
                      <option value="">Select a locality</option>
                      {DELIVERY_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 6: Select Vegetables */}
              {step === 6 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-forest-deep">What would you like?</h2>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-forest-deep">Winter Harvest</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {VEGETABLES.winter.map((veg) => (
                        <label key={veg} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.selectedVegetables.includes(veg)}
                            onChange={() => handleVegetableToggle(veg)}
                            className="h-4 w-4 rounded border-forest-deep"
                          />
                          <span className="text-sm text-forest-deep">{veg}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-forest-deep">Summer Harvest</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {VEGETABLES.summer.map((veg) => (
                        <label key={veg} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.selectedVegetables.includes(veg)}
                            onChange={() => handleVegetableToggle(veg)}
                            className="h-4 w-4 rounded border-forest-deep"
                          />
                          <span className="text-sm text-forest-deep">{veg}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {form.selectedVegetables.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {form.selectedVegetables.length} item{form.selectedVegetables.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              )}

              {/* Step 7: Additional Notes */}
              {step === 7 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-forest-deep">Any special requests?</h2>
                  <Textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Delivery preferences, allergies, or special requests..."
                    className="min-h-[140px]"
                  />
                </div>
              )}
            </motion.div>

            {/* Error Message */}
            {message && status === "error" && (
              <p className="rounded-lg bg-rose-50 p-4 text-sm text-rose-600">{message}</p>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={step === 1 || status === "loading"}
                className="flex-1"
              >
                Previous
              </Button>
              {step < 7 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    status === "loading" ||
                    (step === 1 && !form.fullName) ||
                    (step === 2 && !form.phone) ||
                    (step === 3 && !form.email) ||
                    (step === 4 && !form.deliveryArea) ||
                    (step === 5 && !form.address) ||
                    (step === 6 && form.selectedVegetables.length === 0)
                  }
                  className="flex-1"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex-1"
                >
                  {status === "loading" ? "Reserving..." : "Complete Reservation"}
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
