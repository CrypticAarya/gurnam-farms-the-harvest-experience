import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInCustomer, getSession, getProfile } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Customer Login — Gurnam Farms" }],
  }),
  component: CustomerLogin,
});

function CustomerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    void (async () => {
      const session = await getSession();
      if (session?.user) {
        navigate({ to: "/" });
      }
    })();
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      await signInCustomer({ email: email.trim(), password });
      const session = await getSession();
      const userId = session?.user?.id ?? undefined;
      const profile = await getProfile(userId);
      if (profile?.role === "admin") {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/dashboard" });
      }
    } catch (error) {
      logger.error("Sign in error", { err: String(error) });
      setStatus("error");
      setMessage(error instanceof Error ? error.message : JSON.stringify(error));
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4 py-20 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-[2rem] border border-forest-deep/10 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Customer login</p>
          <h1 className="mt-4 text-3xl font-semibold text-forest-deep">Welcome back</h1>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-forest-deep">Email</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-forest-deep">Password</label>
            <Input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </div>
          {message ? <p className="text-sm text-rose-600">{message}</p> : null}
          <Button type="submit" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
