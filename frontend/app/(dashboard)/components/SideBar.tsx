"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartPulse,
  Home,
  User,
  Users,
  PhoneCall,
  Menu,
  X,
  Calendar,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

type SidebarProps = {
  role: "patient" | "doctor" | "admin";
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const patientLinks = [
    {
      title: "Dashboard",
      href: "/patient/dashboard",
      icon: Home,
    },
    {
      title: "My Appointments",
      href: "/patient/dashboard/appointments",
      icon: Calendar,
    },
    {
      title: "Emergency Contact",
      href: "/patient/dashboard/emergency-contact",
      icon: PhoneCall,
    },
  ];

  const doctorLinks = [
    {
      title: "Dashboard",
      href: "/doctor/dashboard",
      icon: Home,
    },
    {
      title: "Patients",
      href: "/doctor/dashboard/patients",
      icon: Users,
    },
    
  ];

  const adminLinks = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
    },
    {
      title: "Doctors",
      href: "/admin/dashboard/doctors",
      icon: Users,
    },
    {
      title: "Patients",
      href: "/admin/dashboard/patients",
      icon: User,
    },
    {
      title: "Appointments",
      href: "/admin/dashboard/appointments",
      icon: Calendar,
    },
    {
      title: "Profile",
      href: "/admin/dashboard/profile",
      icon: User,
    },
  ];

  const links =
    role === "patient"
      ? patientLinks
      : role === "doctor"
        ? doctorLinks
        : adminLinks;

  const portalTitle =
    role === "patient"
      ? "Patient Portal"
      : role === "doctor"
        ? "Doctor Portal"
        : "Admin Portal";

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        className={`fixed top-4 z-[60] flex h-11 w-11 items-center justify-center
          rounded-xl border border-slate-200 bg-white text-[#075C70]
          shadow-md transition-all duration-300 hover:bg-[#EAF7FB]
          focus:outline-none focus:ring-2 focus:ring-[#0E7490]/30
          md:hidden ${isOpen ? "left-[17.5rem]" : "left-4"}`}
      >
        {isOpen ? <X size={21} /> : <Menu size={21} />}
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen
          w-72 max-w-[85vw] flex-col overflow-y-auto border-r
          border-slate-200/80 bg-white shadow-xl
          transition-transform duration-300 ease-in-out
          md:sticky md:top-0 md:z-30 md:w-64 md:max-w-none
          md:translate-x-0 md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Brand */}
        <div className="relative border-b border-slate-100 px-5 pb-6 pt-6">
          <div className="flex items-center gap-3 pl-10 md:pl-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#075C70] to-[#0E7490] text-white shadow-lg shadow-[#075C70]/20">
              <HeartPulse size={27} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <h1 className="text-[23px] font-extrabold tracking-tight text-slate-900">
                Smart<span className="text-[#0E7490]">Care</span>
              </h1>
              <p className="mt-0.5 text-xs font-medium tracking-wide text-slate-500">
                {portalTitle}
              </p>
            </div>
          </div>

          <div className="mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-[#075C70] to-[#42B8C7]" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Main menu
          </p>

          <div className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;

              // Keep Dashboard from appearing active on every nested page.
              const active =
                pathname === link.href ||
                (link.title !== "Dashboard" &&
                  pathname.startsWith(`${link.href}/`));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeSidebar}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200
                    ${
                      active
                        ? "bg-[#EAF7FB] text-[#075C70] shadow-sm"
                        : "text-slate-500 hover:bg-slate-50 hover:text-[#075C70]"
                    }`}
                >
                  {active && (
                    <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[#0E7490]" />
                  )}

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200
                      ${
                        active
                          ? "bg-white text-[#0E7490] shadow-sm"
                          : "bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-[#0E7490]"
                      }`}
                  >
                    <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                  </span>

                  <span className="flex-1">{link.title}</span>

                  <ChevronRight
                    size={16}
                    className={`shrink-0 transition-all duration-200
                      ${
                        active
                          ? "translate-x-0 text-[#0E7490] opacity-100"
                          : "-translate-x-1 text-slate-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom information */}
        <div className="mt-auto p-4">
          <div className="overflow-hidden rounded-2xl border border-[#D9EDF2] bg-gradient-to-br from-[#F4FBFD] to-white p-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0E7490] shadow-sm">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Your care, connected.
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  SmartCare Health Portal
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-[#075C70]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0E7490]" />
              {portalTitle}
            </div>
          </div>

          <p className="mt-4 text-center text-[10px] text-slate-400">
            © {new Date().getFullYear()} SmartCare
          </p>
        </div>
      </aside>
    </>
  );
}