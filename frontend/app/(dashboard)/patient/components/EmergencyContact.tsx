
"use client";

import {
  Phone,
  Ambulance,
  ShieldAlert,
  HeartPulse,
  ArrowUpRight,
  Clock,
} from "lucide-react";

export default function EmergencyContactPage() {
  const emergencyContacts = [
    {
      title: "Emergency Ambulance",
      number: "140",
      icon: Ambulance,
      description: "For urgent medical assistance and ambulance services.",
      label: "Medical emergency",
    },
    {
      title: "Hospital Emergency",
      number: "+961 1 000 000",
      icon: HeartPulse,
      description: "Contact the hospital emergency department.",
      label: "Hospital support",
    },
    {
      title: "Police",
      number: "112",
      icon: ShieldAlert,
      description: "For urgent situations requiring police assistance.",
      label: "Public safety",
    },
  ];

  return (
    <main className="min-w-0 space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Page heading */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#075C70] to-[#0E7490] p-5 text-white shadow-lg shadow-[#075C70]/10 sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full border-[24px] border-white/5 sm:h-56 sm:w-56" />

        <div className="relative flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 sm:h-14 sm:w-14">
            <HeartPulse size={27} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
              SmartCare assistance
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Emergency Contacts
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-cyan-50 sm:text-base">
              Find contact numbers for urgent situations. If someone is in
              immediate danger, contact the appropriate emergency service.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <p className="text-sm leading-6 text-amber-900">
          <strong>Need urgent help?</strong> Choose the appropriate service
          below. Please verify contact details and local service availability.
          This page is not a substitute for emergency medical care.
        </p>
      </div>

      {/* Contact cards */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Important numbers
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Tap a number to call from a compatible device.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {emergencyContacts.map((contact) => {
            const Icon = contact.icon;

            return (
              <article
                key={contact.title}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B9DFE8] hover:shadow-lg hover:shadow-[#075C70]/[0.06] sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF7FB] text-[#075C70] transition-transform duration-300 group-hover:scale-105">
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                  <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500 sm:text-xs">
                    {contact.label}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {contact.title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                  {contact.description}
                </p>

                <a
                  href={`tel:${contact.number.replace(/[^\d+]/g, "")}`}
                  aria-label={`Call ${contact.title} at ${contact.number}`}
                  className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#075C70] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#064B5B] focus:outline-none focus:ring-4 focus:ring-[#0E7490]/20 active:scale-[0.98]"
                >
                  <Phone size={17} />
                  <span>{contact.number}</span>
                  <ArrowUpRight size={16} className="ml-auto" />
                </a>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
