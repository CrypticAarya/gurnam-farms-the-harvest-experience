import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpCustomer } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [{ title: "Customer Sign Up — Gurnam Farms" }],
  }),
  component: CustomerSignup,
});

function CustomerSignup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      // Validate input
      if (!email.trim()) {
        throw new Error("Email is required");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // Sign up and create profile
      await signUpCustomer({ email: email.trim(), password });
      
      setStatus("success");
      setMessage("Your account has been created! Please check your email for confirmation.");

      // Redirect after success
      setTimeout(() => {
        navigate({ to: "/" });
      }, 1500);
    } catch (error) {
      logger.error("Signup error", { err: String(error) });
      setStatus("error");

      // Parse different error types
      let errorMessage = "An error occurred during signup";
      if (error instanceof Error) {
        errorMessage = error.message;
        // Handle common Supabase errors
        if (errorMessage.includes("already registered")) {
          errorMessage = "This email is already registered. Try logging in instead.";
        } else if (errorMessage.includes("invalid email")) {
          errorMessage = "Please enter a valid email address";
        } else if (errorMessage.includes("password")) {
          errorMessage = "Password must be at least 6 characters";
        }
      } else if (typeof error === "object" && error !== null) {
        errorMessage = JSON.stringify(error);
      }

      setMessage(errorMessage);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4 py-20 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-[2rem] border border-forest-deep/10 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Customer sign up</p>
          <h1 className="mt-4 text-3xl font-semibold text-forest-deep">Create your account</h1>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-forest-deep">Email</label>
            <Input
              type="email"
              required
              disabled={status === "loading" || status === "success"}
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
              disabled={status === "loading" || status === "success"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              minLength={6}
            />
            <p className="mt-1 text-xs text-muted-foreground">At least 6 characters</p>
          </div>
          {message ? (
            <div
              className={`rounded-lg p-3 text-sm ${
                status === "error"
                  ? "border border-rose-200 bg-rose-50 text-rose-700"
                  : status === "success"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border border-forest-deep/10 bg-forest-deep/5 text-forest-deep"
              }`}
            >
              {message}
            </div>
          ) : null}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading" ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating account...
              </span>
            ) : status === "success" ? (
              <span className="flex items-center gap-2">
                <span>✓</span>
                Account created
              </span>
            ) : (
              "Sign up"
            )}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-forest-deep hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
