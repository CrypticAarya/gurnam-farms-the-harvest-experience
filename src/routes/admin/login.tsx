import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInAdmin, signOutAdmin, getSession, signInWithGoogle, onAuthStateChange, isAdmin } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Login — Gurnam Farms" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const verifyAdminAccess = async (userId: string) => {
    try {
      const isUserAdmin = await isAdmin(userId);
      if (isUserAdmin) {
        navigate({ to: "/admin" });
      } else {
        await signOutAdmin();
        setStatus("error");
        setMessage("Access Denied: Admin privileges required.");
      }
    } catch (err) {
      logger.error("Admin verification failed", { err: String(err) });
      await signOutAdmin();
      setStatus("error");
      setMessage("Verification error. Access Denied.");
    }
  };

  useEffect(() => {
    // Check current session immediately
    void (async () => {
      const session = await getSession();
      if (session?.user) {
        await verifyAdminAccess(session.user.id);
      }
    })();

    // Listen to OAuth login state changes
    const unsubscribe = onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await verifyAdminAccess(session.user.id);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      await signInAdmin({ email: email.trim(), password });
      const session = await getSession();
      if (session?.user) {
        await verifyAdminAccess(session.user.id);
      } else {
        throw new Error("Unable to retrieve session after login.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    }
  };

  const handleGoogleSignIn = async () => {
    setStatus("loading");
    setMessage("");
    try {
      await signInWithGoogle(window.location.origin + "/admin/login");
    } catch (error) {
      logger.error("Admin Google Sign-in error", { err: String(error) });
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Google authentication failed");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#0d1510] px-4 py-20 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-[2rem] border border-gold/20 bg-stone-900/90 p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
            🛡️
          </div>
          <p className="text-sm uppercase tracking-[0.3em] text-gold/80">Admin Secure Portal</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Administrator Access</h1>
        </div>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-300">Admin Email</label>
            <Input
              type="email"
              required
              disabled={status === "loading"}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@gurnamfarms.com"
              className="rounded-full border-stone-700 bg-stone-800 text-white focus:border-gold placeholder:text-stone-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-300">Password</label>
            <Input
              type="password"
              required
              disabled={status === "loading"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="rounded-full border-stone-700 bg-stone-800 text-white focus:border-gold placeholder:text-stone-500"
            />
          </div>
          
          {message ? (
            <p className="rounded-xl border border-rose-900/30 bg-rose-950/40 p-3 text-sm text-rose-400">{message}</p>
          ) : null}
          
          <Button type="submit" className="w-full rounded-full bg-gold hover:bg-gold/90 text-stone-950 font-semibold" disabled={status === "loading"}>
            {status === "loading" ? "Verifying..." : "Authorized Sign In"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-stone-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-stone-900/90 px-3 text-stone-400">Secure OAuth</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full border-stone-700 bg-stone-800 text-white hover:bg-stone-700 flex items-center justify-center gap-2"
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
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          Google (Admin Login)
        </Button>

        <p className="mt-8 text-center text-sm text-stone-500">
          Regular Customer?{" "}
          <a href="/login" className="font-semibold text-gold hover:underline">
            Go to Customer Login
          </a>
        </p>
      </div>
    </div>
  );
}
