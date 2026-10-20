
import Link from "next/link";
import { HeartPulse, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "FAQs", href: "/faq" },
  { label: "Sign in", href: "/login" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200/80 bg-[#f5fafc] text-slate-600">
      {/* Subtle brand accent */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 pb-5 pt-10 sm:px-8 sm:pt-14 lg:px-12">
        {/* Main footer */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-10 lg:grid-cols-[1.5fr_0.8fr_1fr] lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 max-w-md lg:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#075c70] text-white shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-11 sm:w-11">
                <HeartPulse size={22} strokeWidth={1.8} />
              </span>

              <span className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                Smart<span className="text-[#0e7490]">Care</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500 sm:mt-5 sm:text-[15px] sm:leading-7">
              Making healthcare simpler by helping patients connect with
              doctors and manage appointments with ease.
            </p>

            <p className="mt-4 text-xs font-medium tracking-wide text-[#0e7490] sm:mt-5 sm:text-sm">
              Better access. Thoughtful care.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
              Quick links
            </h3>

            <ul className="mt-4 space-y-3 sm:mt-5 sm:space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-[#0e7490] sm:text-sm"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
              Get in touch
            </h3>

            <ul className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">
              <li className="flex items-start gap-2.5">
                <Mail
                  size={16}
                  className="mt-0.5 shrink-0 text-[#0e7490]"
                />
                <a
                  href="mailto:contact@smartcare.com"
                  className="break-all text-xs leading-5 text-slate-500 transition-colors hover:text-[#0e7490] sm:text-sm"
                >
                  contact@smartcare.com
                </a>
              </li>

              <li className="flex items-start gap-2.5">
                <Phone
                  size={16}
                  className="mt-0.5 shrink-0 text-[#0e7490]"
                />
                <a
                  href="tel:+96100000000"
                  className="text-xs leading-5 text-slate-500 transition-colors hover:text-[#0e7490] sm:text-sm"
                >
                  +961 00 000 000
                </a>
              </li>

              <li className="flex items-start gap-2.5">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-[#0e7490]"
                />
                <span className="text-xs leading-5 text-slate-500 sm:text-sm">
                  Lebanon
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-9 flex flex-col gap-3 border-t border-slate-200/80 pt-5 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <p className="text-[11px] text-slate-500 sm:text-xs">
            © {new Date().getFullYear()} SmartCare. All rights reserved.
          </p>

          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 text-[11px] font-medium text-slate-500 transition-colors hover:text-[#0e7490] sm:text-xs"
          >
            Your health, made simpler
            <span className="h-1.5 w-1.5 rounded-full bg-[#0e7490]" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
