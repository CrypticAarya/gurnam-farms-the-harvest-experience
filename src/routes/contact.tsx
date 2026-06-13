import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getSession, submitContactSubmission } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { DELIVERY_LOCATIONS } from "@/lib/config";

export const Route = createFileRoute("/contact")({
  beforeLoad: async ({ location }) => {
    const session = await getSession();
    if (!session?.user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  head: () => ({
    meta: [{ title: "Contact Us — Gurnam Farms" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(DELIVERY_LOCATIONS[0] ?? "");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string>("");
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    void (async () => {
      const session = await getSession();
      setSignedIn(!!session?.user);
    })();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!signedIn) {
      navigate({ to: "/login", search: { redirect: "/contact" } });
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      await submitContactSubmission({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        city: city.trim(),
        message: message.trim(),
      });
      setStatus("success");
      setFeedback("Thank you for reaching out. We will reply soon.");
      setName("");
      setEmail("");
      setPhone("");
      setCity("");
      setMessage("");
    } catch (error) {
      logger.error("Contact submit error", { err: String(error) });
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : JSON.stringify(error));
    }
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-forest-deep/10 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Contact us</p>
          <h1 className="mt-4 text-4xl font-semibold text-forest-deep">Send your enquiry</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Need help with an order or want to reserve a weekly share? Send us a message and we&apos;ll be in touch.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-forest-deep">Name</label>
              <Input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Your full name" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-forest-deep">Email</label>
              <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-forest-deep">Phone</label>
              <Input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-forest-deep">Locality</label>
              <select
                value={city}
                onChange={(event) => setCity(event.target.value)}
                required
                className="w-full rounded-full border border-cream/25 bg-cream/10 px-4 py-3 text-sm text-forest-deep outline-none transition-colors focus:border-gold"
              >
                {DELIVERY_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-forest-deep">Message</label>
            <Textarea value={message} onChange={(event) => setMessage(event.target.value)} required placeholder="How can we help you?" />
          </div>
          {feedback ? (
            <p className={`text-sm ${status === "error" ? "text-rose-600" : "text-forest-deep"}`}>{feedback}</p>
          ) : null}
          <Button type="submit" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : "Send message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
