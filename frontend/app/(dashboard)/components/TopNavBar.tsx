
"use client";

import { getUser, User, logout } from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LogOut,
  UserRound,
  Home,
  ChevronDown,
  Menu,
} from "lucide-react";
import Link from "next/link";

type TopNavbarProps = {
  patientName?: string;
};

export default function TopNavbar({
  patientName = "Patient",
}: TopNavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const role = user?.role?.toLowerCase() || "patient";

  const roleLabels: Record<string, string> = {
    patient: "Patient",
    doctor: "Doctor",
    admin: "Admin",
  };

  const roleLabel = roleLabels[role] || "Patient";
  const portalLabel = `${roleLabel} portal`;

  const profilePath =
    role === "doctor"
      ? "/doctor/dashboard/profile"
      : role === "admin"
        ? "/admin/dashboard/profile"
        : "/patient/dashboard/profile";

  const hours = new Date().getHours();
  const greeting =
    hours >= 5 && hours < 12
      ? "Good morning"
      : hours >= 12 && hours < 17
        ? "Good afternoon"
        : "Good evening";

  const displayName = user?.name || patientName;
  const firstName = displayName.trim().split(/\s+/)[0] || roleLabel;

  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "P";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const openSidebar = () => {
    window.dispatchEvent(new Event("smartcare:open-sidebar"));
  };

  return (
    <header className="relative z-40 w-full border-b border-[#DCEEF3] bg-white/95 shadow-[0_3px_16px_rgba(7,92,112,0.035)] backdrop-blur-xl">
      <div className="flex min-h-[72px] w-full items-center gap-2 px-3 sm:min-h-[80px] sm:gap-3 sm:px-6 lg:px-8">
        {/* Mobile menu button lives inside the navbar */}
        <button
          type="button"
          onClick={openSidebar}
          aria-label="Open navigation menu"
          aria-controls="smartcare-sidebar"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DCEEF3] bg-white text-[#075C70] transition hover:bg-[#EAF7FB] focus:outline-none focus:ring-2 focus:ring-[#0E7490]/30 md:hidden"
        >
          <Menu size={21} />
        </button>

        {/* Greeting */}
        <div className="min-w-0 flex-1 py-3">
          <div className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#0E7490] sm:text-[11px] sm:tracking-[0.16em]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0E7490]" />
            <span className="truncate">{portalLabel}</span>
          </div>

          <h1 className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
            {greeting},{" "}
            <span className="text-[#075C70]">{firstName}</span>
            <span className="text-[#0E7490]">.</span>
          </h1>

          <p className="mt-0.5 hidden text-xs text-slate-500 sm:block sm:text-sm">
            {role === "doctor"
              ? "Welcome back! Manage your schedule and patients."
              : role === "admin"
                ? "Welcome back! Manage your SmartCare platform."
                : "Welcome back! Your health journey matters."}
          </p>
        </div>

        {/* Navigation actions */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2.5">
          <Link
            href="/"
            title="Go to home"
            aria-label="Go to home"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-[#EAF7FB] hover:text-[#075C70] focus:outline-none focus:ring-2 focus:ring-cyan-100 sm:h-11 sm:w-11"
          >
            <Home className="h-[18px] w-[18px]" />
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfile((current) => !current)}
              aria-expanded={showProfile}
              aria-label={`Toggle ${roleLabel.toLowerCase()} profile`}
              className={`flex items-center gap-1.5 rounded-xl border px-1.5 py-1.5 transition sm:gap-2.5 sm:px-3 ${
                showProfile
                  ? "border-[#B9DFE8] bg-[#EAF7FB]"
                  : "border-transparent hover:border-[#DCEEF3] hover:bg-[#F5FAFC]"
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#075C70] to-[#0E7490] text-xs font-bold text-white sm:h-10 sm:w-10 sm:text-sm">
                {initials}
              </div>

              <div className="hidden min-w-0 text-left md:block">
                <p className="max-w-[130px] truncate text-sm font-semibold text-slate-800">
                  {displayName}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {roleLabel}
                </p>
              </div>

              <ChevronDown
                className={`hidden h-4 w-4 text-slate-400 transition-transform md:block ${
                  showProfile ? "rotate-180" : ""
                }`}
              />
            </button>

            {showProfile && (
              <>
                <button
                  type="button"
                  aria-label="Close profile menu"
                  className="fixed inset-0 z-[90] cursor-default"
                  onClick={() => setShowProfile(false)}
                />

                <div className="absolute right-0 top-[calc(100%+10px)] z-[100] w-[min(16rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-[#DCEEF3] bg-white shadow-[0_15px_45px_rgba(7,48,61,0.14)]">
                  <div className="bg-gradient-to-br from-[#EAF7FB] to-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#075C70] to-[#0E7490] text-sm font-bold text-white">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {displayName}
                        </p>
                        <p className="mt-1 text-xs text-[#0E7490]">
                          SmartCare {roleLabel.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href={profilePath}
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-[#EAF7FB] hover:text-[#075C70]"
                    >
                      <UserRound className="h-4 w-4" />
                      Profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 sm:hidden"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden items-center gap-2 rounded-xl border border-rose-100 bg-rose-50/70 px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:border-rose-200 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-100 sm:flex"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
