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
      description: "Urgent medical assistance and ambulance services.",
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
      description: "Urgent police assistance and public safety.",
      label: "Public safety",
    },
  ];

  return (
    <main className="min-w-0 space-y-6 overflow-x-clip p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Compact page header */}
      <section className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-[#064957] via-[#075C70] to-[#0E7490] p-5 text-white shadow-sm sm:p-6 lg:p-7">
        <div className="pointer-events-none absolute -right-10 -top-12 -z-10 h-36 w-36 rounded-full border-[18px] border-white/5 sm:h-44 sm:w-44" />

        <div className="relative flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 sm:h-11 sm:w-11">
            <HeartPulse className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-100 sm:text-xs">
              SmartCare assistance
            </p>

            <h1 className="mt-1.5 text-xl font-bold tracking-tight sm:text-2xl">
              Emergency Contacts
            </h1>

            <p className="mt-2 max-w-md text-sm leading-5 text-cyan-50/90">
              Important numbers for medical emergencies and public safety.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency notice */}
      <div className="flex min-w-0 items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 sm:p-4">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 sm:h-5 sm:w-5" />

        <p className="min-w-0 text-xs leading-5 text-amber-900 sm:text-sm sm:leading-6">
          <strong>Need urgent help?</strong>{" "}
          Contact the appropriate service below. Verify local contact details
          and availability when possible.
        </p>
      </div>

      {/* Emergency contact cards */}
      <section>
        <div className="mb-3 sm:mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Important numbers
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Select a number to call from your device.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {emergencyContacts.map((contact) => {
            const Icon = contact.icon;

            return (
              <article
                key={contact.title}
                className="flex min-w-0 flex-col rounded-2xl border border-[#DCEEF3] bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.025)] transition duration-200 hover:border-[#B9DFE8] hover:shadow-md sm:p-5"
              >
                <div className="flex min-w-0 items-start justify-between gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF7FB]">
                    <Icon className="h-4 w-4 text-[#075C70]" strokeWidth={1.8} />
                  </div>

                  <span className="max-w-[65%] rounded-full bg-slate-50 px-2 py-1 text-right text-[10px] font-semibold leading-4 text-slate-500 sm:text-xs">
                    {contact.label}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold leading-5 text-slate-900">
                  {contact.title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-5 text-slate-500">
                  {contact.description}
                </p>

                <a
                  href={`tel:${contact.number.replace(/[^\d+]/g, "")}`}
                  aria-label={`Call ${contact.title} at ${contact.number}`}
                  className="mt-4 flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-xl bg-[#075C70] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064B5B] focus:outline-none focus:ring-4 focus:ring-[#0E7490]/20 active:scale-[0.98]"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span className="truncate">{contact.number}</span>
                  <ArrowUpRight className="ml-auto h-4 w-4 shrink-0" />
                </a>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}