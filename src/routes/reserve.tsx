import React, { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getSession, submitReservation, fetchReservationsByProfile } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { DELIVERY_AREAS, VEGETABLES } from "@/lib/config";
import { motion } from "motion/react";

export const Route = createFileRoute("/reserve")({
  beforeLoad: async ({ location }) => {
    const session = await getSession();
    if (!session?.user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  head: () => ({
    meta: [{ title: "Reserve Your Field — Gurnam Farms" }],
  }),
  component: ReservePage,
});

// Separate address sub-fields so we can assemble the final address string on submit
interface AddressFields {
  houseNo: string;
  buildingName: string;
  streetArea: string;
  landmark: string;
  city: string;
  pincode: string;
}

function buildAddressString(a: AddressFields): string {
  const parts = [
    a.houseNo,
    a.buildingName,
    a.streetArea,
    a.landmark ? `Near ${a.landmark}` : "",
    a.city,
    a.pincode,
  ].filter(Boolean);
  return parts.join(", ");
}

const TOTAL_STEPS = 7;

function ReservePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    deliveryArea: "",
    selectedVegetables: [] as string[],
    notes: "",
  });
  const [address, setAddress] = useState<AddressFields>({
    houseNo: "",
    buildingName: "",
    streetArea: "",
    landmark: "",
    city: "",
    pincode: "",
  });

  // "review" = show summary, "form" = multi-step form
  const [phase, setPhase] = useState<"form" | "review" | "success">("form");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [message, setMessage] = useState<string>("");
  const [hasActiveReservation, setHasActiveReservation] = useState(false);

  React.useEffect(() => {
    void (async () => {
      try {
        const session = await getSession();
        if (session?.user?.email) {
          setForm((prev) => ({ ...prev, email: session.user.email || "" }));
          const reservations = await fetchReservationsByProfile();
          const active = reservations.some(r => r.status === "Pending" || r.status === "Confirmed");
          setHasActiveReservation(active);
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
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  // Called when user clicks "Review Reservation" on step 7
  const handleGoToReview = () => {
    setPhase("review");
  };

  // Called when user clicks "Edit" on the review page
  const handleEditFromReview = () => {
    setPhase("form");
  };

  // The *only* place submitReservation() is called
  const handleConfirm = async () => {
    setStatus("loading");
    setMessage("");

    const fullAddress = buildAddressString(address);

    if (!form.deliveryArea) {
      setMessage("Please select a delivery area.");
      setStatus("idle");
      return;
    }

    if (!fullAddress) {
      setMessage("Please fill in your delivery address.");
      setStatus("idle");
      return;
    }

    if (form.selectedVegetables.length === 0) {
      setMessage("Please select at least one vegetable.");
      setStatus("idle");
      return;
    }

    try {
      const session = await getSession();
      await submitReservation({
        full_name: form.fullName.trim(),
        phone_number: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        delivery_area: form.deliveryArea,
        address: fullAddress,
        selected_vegetables: form.selectedVegetables,
        notes: form.notes.trim(),
        profile_id: session?.user?.id ?? null,
      });
      setPhase("success");
    } catch (error) {
      logger.error("Reservation error", { err: String(error) });
      setMessage(error instanceof Error ? error.message : JSON.stringify(error));
      setStatus("idle");
    }
  };

  // ----- Derived helpers -----
  const isAddressValid =
    !!address.houseNo && !!address.streetArea && !!address.city && !!address.pincode;

  const isNextDisabled = (() => {
    if (status === "loading") return true;
    if (step === 1) return !form.fullName;
    if (step === 2) return !form.phone;
    if (step === 3) return !form.email;
    if (step === 4) return !form.deliveryArea;
    if (step === 5) return !isAddressValid;
    if (step === 6) return form.selectedVegetables.length === 0;
    return false;
  })();

  // ----- Render helpers -----

  if (phase === "success") {
    return (
      <div className="min-h-screen bg-cream px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl">
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
            <Button onClick={() => navigate({ to: "/" })} className="mt-8">
              Return to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (hasActiveReservation) {
    return (
      <div className="min-h-screen bg-cream px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 sm:p-12 text-center shadow-xl backdrop-blur-sm"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="text-3xl font-semibold text-amber-900">Active Reservation Found</h1>
            <p className="mt-4 text-base text-amber-800">
              You already have an active weekly harvest reservation. We process one active reservation per customer to ensure everyone receives their share.
            </p>
            <Button
              onClick={() => navigate({ to: "/dashboard" })}
              className="mt-8 bg-amber-600 hover:bg-amber-700"
            >
              View My Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (phase === "review") {
    const fullAddress = buildAddressString(address);
    return (
      <div className="min-h-screen bg-cream px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Step 8 of 8</p>
            <h1 className="mt-4 text-3xl font-semibold text-forest-deep">Review Your Reservation</h1>
            <p className="mt-2 text-sm text-muted-foreground">Check everything looks right before confirming.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-forest-deep/10 bg-white/90 p-8 shadow-xl backdrop-blur-sm space-y-6"
          >
            {/* Personal Details */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gold mb-3">Personal Details</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
                <div><span className="text-muted-foreground">Name:</span> <span className="font-medium text-forest-deep">{form.fullName}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium text-forest-deep">{form.phone}</span></div>
                <div className="sm:col-span-2"><span className="text-muted-foreground">Email:</span> <span className="font-medium text-forest-deep">{form.email}</span></div>
              </div>
            </div>

            <hr className="border-forest-deep/10" />

            {/* Delivery Info */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gold mb-3">Delivery Information</h2>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Delivery Area:</span> <span className="font-medium text-forest-deep">{form.deliveryArea}</span></div>
                <div><span className="text-muted-foreground">Address:</span> <span className="font-medium text-forest-deep">{fullAddress}</span></div>
              </div>
            </div>

            <hr className="border-forest-deep/10" />

            {/* Vegetables */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gold mb-3">Selected Harvest</h2>
              <div className="flex flex-wrap gap-2">
                {form.selectedVegetables.map(veg => (
                  <span key={veg} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{veg}</span>
                ))}
              </div>
            </div>

            {/* Notes */}
            {form.notes && (
              <>
                <hr className="border-forest-deep/10" />
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-gold mb-3">Special Requests</h2>
                  <p className="text-sm text-forest-deep">{form.notes}</p>
                </div>
              </>
            )}
          </motion.div>

          {message && (
            <p className="rounded-lg bg-rose-50 p-4 text-sm text-rose-600">{message}</p>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleEditFromReview}
              disabled={status === "loading"}
              className="flex-1"
            >
              ← Edit
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={status === "loading"}
              className="flex-1 bg-forest-deep hover:bg-forest-deep/90 text-white"
            >
              {status === "loading" ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Confirming...
                </span>
              ) : (
                "Confirm Reservation"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ----- Main form (steps 1–7) -----
  return (
    <div className="min-h-screen bg-cream px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl">
        {/* NOTE: No <form onSubmit> wrapper. Navigation and submission are fully manual. */}
        <div className="space-y-8">
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

            {/* Step 5: Delivery Address (full structured fields) */}
            {step === 5 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-forest-deep">What's your exact delivery address?</h2>
                <p className="text-sm text-muted-foreground">Fields marked <span className="text-rose-500">*</span> are required.</p>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-forest-deep">
                      House / Flat Number <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={address.houseNo}
                      onChange={(e) => setAddress({ ...address, houseNo: e.target.value })}
                      placeholder="e.g. 12B, Flat 302"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-forest-deep">
                      Building / Society Name
                    </label>
                    <Input
                      type="text"
                      value={address.buildingName}
                      onChange={(e) => setAddress({ ...address, buildingName: e.target.value })}
                      placeholder="e.g. Green Valley Apartments"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-forest-deep">
                      Street / Area <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={address.streetArea}
                      onChange={(e) => setAddress({ ...address, streetArea: e.target.value })}
                      placeholder="e.g. Model Town, Sector 22"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-forest-deep">
                      Landmark <span className="text-xs text-muted-foreground">(optional)</span>
                    </label>
                    <Input
                      type="text"
                      value={address.landmark}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      placeholder="e.g. Near Punjab National Bank"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-forest-deep">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="e.g. Patiala"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-forest-deep">
                        Pincode <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, "") })}
                        placeholder="e.g. 147001"
                      />
                    </div>
                  </div>
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

                {form.selectedVegetables.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {form.selectedVegetables.length} item{form.selectedVegetables.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            )}

            {/* Step 7: Notes */}
            {step === 7 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-forest-deep">Any special requests?</h2>
                <p className="text-sm text-muted-foreground">Delivery preferences, allergies, or anything else we should know.</p>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Leave at the door, allergic to spinach..."
                  className="min-h-[140px]"
                />
              </div>
            )}
          </motion.div>

          {/* Error Message */}
          {message && (
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
            {step < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isNextDisabled}
                className="flex-1"
              >
                Next
              </Button>
            ) : (
              // Step 7: "Review Reservation" button — does NOT submit to DB
              <Button
                type="button"
                onClick={handleGoToReview}
                disabled={status === "loading"}
                className="flex-1 bg-forest-deep hover:bg-forest-deep/90 text-white"
              >
                Review Reservation →
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
