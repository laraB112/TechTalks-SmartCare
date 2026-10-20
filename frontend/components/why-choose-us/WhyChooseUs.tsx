
"use client";

import {
  CalendarCheck,
  Clock3,
  Headset,
  MapPin,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: <CalendarCheck size={20} />,
    title: "Easy Booking",
    description: "Book appointments in just a few steps.",
  },
  {
    icon: <Stethoscope size={20} />,
    title: "Expert Specialists",
    description: "Find the right doctor for your needs.",
  },
  {
    icon: <Clock3 size={20} />,
    title: "Less Waiting",
    description: "Choose a convenient appointment time.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Your Privacy",
    description: "Your personal information matters.",
  },
  {
    icon: <MapPin size={20} />,
    title: "Convenient Access",
    description: "Find care without the extra hassle.",
  },
  {
    icon: <Headset size={20} />,
    title: "Patient Support",
    description: "Get help when you need it.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-smartcare"
      className="relative overflow-hidden bg-[#fbfdff] py-12 sm:py-16 lg:py-24"
    >
      {/* Subtle background accent */}
      <div className="pointer-events-none absolute right-0 top-0 -z-0 h-56 w-56 rounded-full bg-cyan-100/30 blur-3xl sm:h-80 sm:w-80" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Section heading */}
        <div className="why-enter mb-7 max-w-2xl sm:mb-10 lg:mb-12">
          <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
            <span className="h-px w-6 bg-[#0e7490] sm:w-9" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#0e7490] sm:text-xs sm:tracking-[0.22em]">
              Why SmartCare
            </span>
          </div>

          <h2 className="text-3xl font-semibold leading-[1.12] tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-5xl">
            Healthcare that works
            <br className="hidden sm:block" /> around{" "}
            <span className="font-normal text-[#0e7490]">you.</span>
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:mt-5 sm:text-base sm:leading-7">
            A simpler way to connect with doctors, manage appointments,
            and make your healthcare journey easier.
          </p>
        </div>

        {/* Feature cards: 2 columns on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="why-enter min-w-0"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .why-enter {
          animation: fadeUp 700ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }

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

        @media (prefers-reduced-motion: reduce) {
          .why-enter {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
