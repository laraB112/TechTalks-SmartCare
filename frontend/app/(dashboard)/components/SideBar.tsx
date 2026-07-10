"use client"

import Link from "next/link";
import { logout } from "@/app/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  HeartPulse,
  Home,
  LogOut,
  Settings,
  User,
  Users,
  PhoneCall,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

type SidebarProps = {
  role: "patient" | "doctor";
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
      href: "/doctor/patients",
      icon: Users,
    },
    {
      title: "Schedule",
      href: "/doctor/schedule",
      icon: Calendar,
    },
    {
      title: "Profile",
      href: "/doctor/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/doctor/settings",
      icon: Settings,
    },
  ];

  const links = role === "patient" ? patientLinks : doctorLinks;
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-md md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside
        className={` fixed left-0 top-0 z-40 flex h-scroll  w-72 flex-col
                      border-r border-gray-200 bg-white transition-transform duration-300
                      ${isOpen ? "translate-x-0" : "-translate-x-full"}
                       md:static md:translate-x-0 md:flex `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-6">
          <div className="">
            <HeartPulse className="h-11 w-11 text-blue-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Smart<span className="text-blue-600">Care</span>
            </h1>

            <p className="text-sm text-gray-500">
              {role === "patient"
                ? "Patient Portal"
                : "Doctor Portal"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {links.map((link) => {
            const Icon = link.icon;

            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
                ${active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
              >
                <Icon size={20} />

                {link.title}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 pb-20">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm 
                         font-medium text-red-500 transition hover:bg-red-50">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}