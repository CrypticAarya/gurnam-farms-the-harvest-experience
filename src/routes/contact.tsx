import { useState, type FormEvent } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getSession, submitContactSubmission } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, profile } = useAuth();

  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      await submitContactSubmission({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        message: message.trim(),
      });
      setStatus("success");
      setFeedback("Thank you for reaching out. We will reply soon.");
      setMessage("");
    } catch (error) {
      logger.error("Contact submit error", { err: String(error) });
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : JSON.stringify(error));
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-cream px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-forest-deep/10 bg-white/90 p-12 text-center shadow-xl backdrop-blur-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
            <span className="text-3xl">✉️</span>
          </div>
          <h1 className="text-3xl font-semibold text-forest-deep">Message Sent!</h1>
          <p className="mt-4 text-base text-muted-foreground">
            Thank you for reaching out. Our team will get back to you shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-forest-deep/10 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Contact us</p>
          <h1 className="mt-4 text-4xl font-semibold text-forest-deep">Send your enquiry</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Need help with an order or want to reserve a weekly share? Send us a message and we&apos;ll be in touch.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-forest-deep">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your full name"
              className="rounded-full border-forest-deep/20 focus:border-gold"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-forest-deep">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="rounded-full border-forest-deep/20 focus:border-gold"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-forest-deep">Phone</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+91 98765 43210"
              className="rounded-full border-forest-deep/20 focus:border-gold"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-forest-deep">Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="How can we help you?"
              className="min-h-[140px]"
            />
          </div>

          {feedback && status === "error" ? (
            <p className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-600">
              {feedback}
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full rounded-full bg-forest-deep hover:bg-forest-deep/90 text-white"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending...
              </span>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
