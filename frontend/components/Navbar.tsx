
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { getUser, logout, type User } from "@/app/lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

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

  const navLink =
    "relative py-2 text-sm font-medium transition-colors duration-200 hover:text-[#0e7490]";

  const activeNavLink =
    "relative py-2 text-sm font-semibold text-[#075c70] after:absolute after:inset-x-0 after:-bottom-[2px] after:h-[2px] after:rounded-full after:bg-[#0e7490]";

  const loginButton =
    "inline-flex items-center justify-center rounded-xl border border-slate-200/90 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-cyan-200 hover:bg-cyan-50/80 hover:text-[#075c70]";

  const registerButton =
    "group inline-flex items-center justify-center gap-2 rounded-xl bg-[#075c70] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(7,92,112,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#064c5d] hover:shadow-[0_7px_20px_rgba(7,92,112,0.18)]";

  const dashboardButton =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#075c70] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064c5d]";

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
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-[#fbfdff]/90 shadow-[0_2px_14px_rgba(15,70,90,0.025)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="flex h-[66px] items-center justify-between sm:h-[76px]">
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex shrink-0 items-center gap-2 sm:gap-2.5"
            aria-label="SmartCare home"
          >
            <span className="flex h-9 w-9 items-center justify-center sm:h-11 sm:w-11">
              <img
                src="/images/logo3.png"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain"
              />
            </span>

            <span className="text-[23px] font-semibold tracking-[-0.055em] text-slate-900 sm:text-[27px]">
              Smart<span className="text-[#0e7490]">Care</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`${isActive ? activeNavLink : navLink} ${
                    isActive ? "" : "text-slate-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

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
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="smartcare-mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-[#075c70] md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        <div
          id="smartcare-mobile-menu"
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
            isMenuOpen
              ? "grid-rows-[1fr] opacity-100"
              : "pointer-events-none grid-rows-[0fr] opacity-0"
          }`}
          aria-hidden={!isMenuOpen}
        >
          <div className="overflow-hidden">
            <div className="border-t border-slate-200/70 pb-5 pt-4">
              <div className="flex flex-col gap-1">
                {links.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={isActive ? "page" : undefined}
                      tabIndex={isMenuOpen ? 0 : -1}
                      className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors ${
                        isActive
                          ? "bg-[#eaf6fa] font-semibold text-[#075c70]"
                          : "font-medium text-slate-600 hover:bg-white hover:text-[#075c70]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="my-4 border-t border-slate-200/70" />

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
    </nav>
  );
}
