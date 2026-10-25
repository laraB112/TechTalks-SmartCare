"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { getUser, logout, type User } from "@/app/lib/auth";

export default function Navbar() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/faq", label: "FAQ" },
  ];

  const dashboardPath =
    user?.role === "doctor"
      ? "/doctor/dashboard"
      : user?.role === "admin"
        ? "/admin/dashboard"
        : "/patient/dashboard";

  const lightNavbar = true;

  const navLink = `relative py-2 text-[13px] font-medium tracking-[0.01em] transition-colors duration-200 ${
    lightNavbar
      ? "text-slate-600 hover:text-[#087e8b]"
      : "text-white/85 hover:text-white"
  }`;

  const activeNavLink = `relative py-2 text-[13px] font-semibold tracking-[0.01em] after:absolute after:inset-x-0 after:-bottom-[5px] after:h-[2px] after:rounded-full ${
    lightNavbar
      ? "text-[#075c70] after:bg-[#0e9aa7]"
      : "text-white after:bg-[#a9e4e6]"
  }`;

  const loginButton = `inline-flex h-10 items-center justify-center rounded-full border px-5 text-[13px] font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e9aa7] focus-visible:ring-offset-2 ${
    lightNavbar
      ? "border-[#c9e0e5] bg-white/65 text-[#244b55] shadow-sm hover:border-[#85c7d1] hover:bg-[#f0fafb] hover:text-[#075c70]"
      : "border-white/40 bg-white/[0.08] text-white backdrop-blur-md hover:border-white/75 hover:bg-white/[0.16]"
  }`;

  const registerButton = `group inline-flex h-10 items-center justify-center gap-2 rounded-full border px-5 text-[13px] font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e9aa7] focus-visible:ring-offset-2 ${
    lightNavbar
      ? "border-[#075c70] bg-[#075c70] text-white shadow-[0_5px_16px_rgba(7,92,112,0.15)] hover:-translate-y-0.5 hover:border-[#064c5d] hover:bg-[#064c5d]"
      : "border-white/80 bg-white text-[#075c70] shadow-[0_5px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:border-white hover:bg-[#eafafa]"
  }`;

  const dashboardButton =
    "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#075c70] bg-[#075c70] px-5 text-[13px] font-semibold tracking-wide text-white transition hover:border-[#064c5d] hover:bg-[#064c5d]";

  const mobileIconButton =
    "flex h-10 w-10 items-center justify-center rounded-full border border-[#d6e6e9] bg-white text-[#244b55] transition-colors hover:bg-[#edf8fa] md:hidden";

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleLogout() {
    logout();
    setUser(null);
    closeMenu();
    window.location.href = "/";
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#dce9ec] bg-white text-slate-800 shadow-[0_3px_18px_rgba(15,70,90,0.06)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="flex h-[68px] items-center justify-between sm:h-[76px]">
          {/* Brand */}
          <Link
            href="/"
            onClick={closeMenu}
            aria-label="SmartCare home"
            className="group flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10">
              <img
                src="/images/logo3.png"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </span>

            <span className="font-sans text-[24px] font-bold leading-none tracking-[-0.065em] text-[#153943] sm:text-[27px]">
              Smart
              <span className="font-medium text-[#0e8493]">Care</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex lg:gap-9">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={isActive ? activeNavLink : navLink}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link href={dashboardPath} className={dashboardButton}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className={loginButton}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={loginButton}>
                  Login
                </Link>

                <Link href="/register" className={registerButton}>
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="smartcare-mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
            className={mobileIconButton}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        <div
          id="smartcare-mobile-menu"
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
            isMenuOpen
              ? "grid-rows-[1fr] opacity-100"
              : "pointer-events-none grid-rows-[0fr] opacity-0"
          }`}
          aria-hidden={!isMenuOpen}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="border-t border-[#075C70]/10 bg-white shadow-xl">
              <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
                {links.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname === link.href ||
                        pathname.startsWith(`${link.href}/`);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      tabIndex={isMenuOpen ? 0 : -1}
                      className={`block rounded-lg px-4 py-3 font-medium transition-colors ${
                        isActive
                          ? "bg-[#075C70]/10 text-[#075C70]"
                          : "text-slate-800 hover:bg-[#075C70]/10 hover:text-[#075C70]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="mx-5 border-t border-[#dce9ec]" />

              <div className="px-5 py-4">
                {user ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href={dashboardPath}
                      onClick={closeMenu}
                      tabIndex={isMenuOpen ? 0 : -1}
                      className={dashboardButton}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      tabIndex={isMenuOpen ? 0 : -1}
                      className={loginButton}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      tabIndex={isMenuOpen ? 0 : -1}
                      className={loginButton}
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMenu}
                      tabIndex={isMenuOpen ? 0 : -1}
                      className={registerButton}
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
