
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  
  HeartPulse,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://TechTalks-SmartCare.test/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to sign in. Please check your details."
        );
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      const role = String(data.user?.role || "").toLowerCase();

      if (role === "doctor") {
        window.location.href = "/doctor/dashboard";
      } else if (role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/patient/dashboard";
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#eef7fa] p-2 sm:p-5">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />

      <div className="relative grid w-full max-w-5xl grid-cols-[0.8fr_1.2fr] overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_25px_80px_-25px_rgba(7,92,112,0.30)] sm:rounded-3xl lg:min-h-[620px] animate-[fadeIn_.6s_ease-out]">
        {/* Teal welcome panel */}
        <section className="relative flex min-w-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#064958] via-[#075C70] to-[#0E7490] p-3 text-white sm:p-6 lg:p-10">
          <div className="pointer-events-none absolute -right-14 top-16 h-36 w-36 rounded-full border border-white/10 sm:h-56 sm:w-56" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-cyan-300/10 blur-xl sm:h-48 sm:w-48" />

          <Link href="/" className="relative z-10 flex min-w-0 items-center gap-1.5 sm:gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20 sm:h-10 sm:w-10 sm:rounded-xl">
              <HeartPulse className="h-4 w-4 sm:h-6 sm:w-6" />
            </span>
            <span className="truncate text-xs font-bold tracking-tight sm:text-xl">
              SmartCare
            </span>
          </Link>

          <div className="relative z-10 my-6 sm:my-10">
            <span className="mb-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[9px] font-medium sm:mb-5 sm:gap-2 sm:px-3 sm:text-xs">
             
              Your health, simplified
            </span>

            <h1 className="text-lg font-bold leading-tight tracking-tight sm:text-3xl lg:text-5xl">
              Welcome
              <span className="mt-1 block text-cyan-200">back.</span>
            </h1>

            <p className="mt-3 text-[10px] leading-relaxed text-white/75 sm:mt-5 sm:text-sm sm:leading-7 lg:text-base">
              Your healthcare journey, all in one place. Sign in to manage
              appointments and stay connected with your care team.
            </p>

            <div className="mt-5 hidden items-center gap-3 rounded-xl border border-white/15 bg-white/[0.08] p-3 sm:flex lg:mt-8 lg:p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <ShieldCheck className="h-5 w-5 text-cyan-200" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Care you can trust</p>
                <p className="mt-1 text-xs leading-relaxed text-white/65">
                  A simpler way to stay on top of your appointments.
                </p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-[8px] leading-relaxed text-white/55 sm:text-xs">
            Your wellbeing matters. Every step of the way.
          </p>
        </section>

        {/* White login panel */}
        <section className="flex min-w-0 items-center bg-white p-3 sm:p-6 lg:p-12">
          <div className="mx-auto w-full min-w-0 max-w-md animate-[slideUp_.55s_ease-out]">
            <div className="mb-5 sm:mb-8">
              <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#eaf7fb] text-[#075C70] sm:mb-4 sm:h-11 sm:w-11">
                <LockKeyhole className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-3xl">
                Sign in
              </h2>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-500 sm:mt-2 sm:text-sm">
                Enter your details to access your account.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-4 flex min-w-0 items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-2 text-[10px] leading-relaxed text-red-700 sm:mb-5 sm:rounded-xl sm:p-3 sm:text-sm"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5 sm:space-y-5">
              <div className="min-w-0">
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-[10px] font-semibold text-slate-700 sm:mb-2 sm:text-sm"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 sm:left-3.5 sm:h-[18px] sm:w-[18px]" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50/70 py-2.5 pl-8 pr-2 text-[10px] text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 focus:border-[#0E7490] focus:bg-white focus:ring-2 focus:ring-[#0E7490]/15 sm:rounded-xl sm:py-3.5 sm:pl-11 sm:pr-4 sm:text-sm"
                  />
                </div>
              </div>

              <div className="min-w-0">
                <div className="mb-1.5 flex items-center justify-between gap-1 sm:mb-2">
                  <label
                    htmlFor="password"
                    className="text-[10px] font-semibold text-slate-700 sm:text-sm"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 sm:left-3.5 sm:h-[18px] sm:w-[18px]" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50/70 py-2.5 pl-8 pr-8 text-[10px] text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 focus:border-[#0E7490] focus:bg-white focus:ring-2 focus:ring-[#0E7490]/15 sm:rounded-xl sm:py-3.5 sm:pl-11 sm:pr-11 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-[#075C70] focus:outline-none focus:ring-2 focus:ring-[#0E7490]/20 sm:right-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5 sm:h-[18px] sm:w-[18px]" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 sm:h-[18px] sm:w-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#075C70] to-[#0E7490] px-3 py-2.5 text-[11px] font-semibold text-white shadow-md shadow-[#075C70]/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#075C70]/25 focus:outline-none focus:ring-2 focus:ring-[#0E7490]/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:rounded-xl sm:py-3.5 sm:text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to SmartCare
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-[10px] leading-relaxed text-slate-500 sm:mt-7 sm:text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#075C70] underline-offset-4 transition hover:text-[#0E7490] hover:underline"
              >
                Create one
              </Link>
            </p>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[8px] text-slate-400 sm:mt-8 sm:text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0E7490]" />
              Secure access to your healthcare account
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
