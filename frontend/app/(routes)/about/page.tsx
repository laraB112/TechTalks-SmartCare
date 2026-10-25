
"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  Heart,
  CalendarDays,
  Clock,
  Users,
  Lightbulb,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: Heart,
    title: "Smart Triage",
    description:
      "Describe your symptoms and receive a specialty recommendation to help guide your next step.",
  },
  {
    number: "02",
    icon: CalendarDays,
    title: "Easy Appointments",
    description:
      "Find an appropriate doctor and book an available appointment without unnecessary hassle.",
  },
  {
    number: "03",
    icon: Clock,
    title: "Queue Tracking",
    description:
      "Keep track of your queue position and get a clearer idea of when your turn is approaching.",
  },
  {
    number: "04",
    icon: Users,
    title: "Doctor Access",
    description:
      "Explore available doctors and their specialties to find care suited to your needs.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[#f7fbfc] pt-[68px] text-slate-800 sm:pt-[76px]">
        {/* Background accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#d8f0f5] opacity-60 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-[520px] h-72 w-72 rounded-full bg-[#eaf7fb] opacity-70 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8 lg:pb-20 lg:pt-16">
          {/* Introduction */}
          <section className="animate-fade-up mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d5eaf0] bg-white/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#0e7490] shadow-sm backdrop-blur-sm sm:text-sm">
              <Heart className="h-4 w-4" />
              GET TO KNOW SMARTCARE
            </span>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:mt-6 sm:text-4xl lg:text-5xl">
              Healthcare, made{" "}
              <span className="text-[#0e7490]">simpler.</span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base sm:leading-8 lg:text-lg">
              SmartCare is a smart triage healthcare platform designed to
              simplify the patient journey. From finding the right medical
              specialty to booking an appointment, we help make every step
              easier to navigate.
            </p>
          </section>

          {/* Features */}
          <section className="mt-10 sm:mt-14 lg:mt-16">
            <div className="mb-5 sm:mb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0e7490] sm:text-sm">
                What we offer
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                Better guidance at every step
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.number}
                    className="animate-fade-up group relative overflow-hidden rounded-2xl border border-[#dfebef] bg-white/75 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#b8dce5] hover:bg-white hover:shadow-[0_14px_35px_rgba(7,92,112,0.07)] sm:p-6 lg:p-7"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf6fa] text-[#0e7490] transition-colors duration-300 group-hover:bg-[#075c70] group-hover:text-white sm:h-12 sm:w-12">
                        <Icon
                          className="h-5 w-5 sm:h-[22px] sm:w-[22px]"
                          strokeWidth={1.7}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                            {feature.title}
                          </h3>
                          <span className="text-xs font-medium tracking-wider text-slate-300">
                            {feature.number}
                          </span>
                        </div>

                        <p className="text-sm leading-6 text-slate-600 sm:text-[15px] sm:leading-7">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Mission */}
          <section className="animate-fade-up relative mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#075c70] to-[#0b7181] p-5 text-white shadow-[0_14px_40px_rgba(7,92,112,0.12)] sm:mt-10 sm:rounded-3xl sm:p-8 lg:mt-12 lg:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full border border-white/10 sm:h-72 sm:w-72"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-1 -top-10 h-40 w-40 rounded-full border border-white/10 sm:h-52 sm:w-52"
            />

            <div className="relative flex flex-col gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-cyan-100">
                  <Lightbulb className="h-5 w-5" strokeWidth={1.7} />
                  OUR MISSION
                </div>

                <h2 className="text-xl font-semibold leading-snug tracking-tight sm:text-2xl lg:text-3xl">
                  Helping patients take the next step with confidence.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-cyan-50/90 sm:text-base sm:leading-8">
                  Our mission is to make healthcare easier to navigate by
                  guiding patients toward suitable specialties, simplifying
                  appointment booking, and helping reduce unnecessary waiting.
                </p>
              </div>

              <Link
                href="/register"
                className="group inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-white/80 bg-white px-5 py-3 text-sm font-semibold text-[#075c70] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#eaf7fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#075c70]"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </section>

          {/* Trust statement */}
          <div className="mt-6 flex justify-center sm:mt-8">
            <div className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-[#dce9ec] bg-white/65 px-3.5 py-2.5 backdrop-blur-sm sm:px-5">
              <ShieldCheck
                className="h-5 w-5 shrink-0 text-[#0e7490]"
                strokeWidth={1.7}
              />
              <span className="text-xs font-medium leading-5 text-slate-600 sm:text-sm">
                Designed with patient convenience and privacy in mind
              </span>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-up {
          animation: fadeUp 650ms ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
