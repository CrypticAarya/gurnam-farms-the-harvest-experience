import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInCustomer, signInWithGoogle } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: search.redirect as string | undefined,
  }),
  head: () => ({
    meta: [{ title: "Customer Login — Gurnam Farms" }],
  }),
  component: CustomerLogin,
});

function CustomerLogin() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const { user, profile, isLoading } = useAuth();

  useEffect(() => {
    // If the user and profile are already loaded, redirect them
    if (!isLoading && user && profile) {
      if (profile.role === "admin") {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: search.redirect || "/dashboard" });
      }
    }
  }, [user, profile, isLoading, navigate, search.redirect]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      await signInCustomer({ email: email.trim(), password });
      // Redirection will happen automatically via the useEffect on user/profile change
    } catch (error) {
      logger.error("Sign in error", { err: String(error) });
      setStatus("error");
      setMessage(error instanceof Error ? error.message : JSON.stringify(error));
    }
  };

  const handleGoogleSignIn = async () => {
    setStatus("loading");
    setMessage("");
    try {
      await signInWithGoogle(window.location.origin + "/login" + (search.redirect ? `?redirect=${encodeURIComponent(search.redirect)}` : ""));
    } catch (error) {
      logger.error("Google Sign-in error", { err: String(error) });
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Google authentication failed");
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
              disabled={status === "loading"}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="rounded-full border-forest-deep/20 focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-forest-deep">Password</label>
            <Input
              type="password"
              required
              disabled={status === "loading"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="rounded-full border-forest-deep/20 focus:border-gold"
            />
          </div>
          
          {message ? (
            <p className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-600">{message}</p>
          ) : null}
          
          <Button type="submit" className="w-full rounded-full bg-forest-deep hover:bg-forest-deep/90 text-white" disabled={status === "loading"}>
            {status === "loading" ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-forest-deep/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/90 px-3 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full border-forest-deep/20 text-forest-deep hover:bg-forest-deep/5 flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={status === "loading"}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/signup" className="font-semibold text-forest-deep hover:underline">
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}
