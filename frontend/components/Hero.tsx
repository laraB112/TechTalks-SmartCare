"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Check } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[680px] overflow-hidden bg-[#073d49] text-white sm:min-h-[740px] lg:min-h-[780px]">
      {/* Full-bleed hospital background */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/bg10.jpg"
          alt="Modern hospital interior"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Rich teal overlays for contrast */}
      <div className="absolute inset-0 -z-10 bg-[#063f4b]/55" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#052f39]/60 via-[#064653]/30 to-[#042f39]/75" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(14,116,144,0.18)_0%,transparent_58%,rgba(3,40,49,0.3)_100%)]" />

      {/* Soft glow behind the hero content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[50%] -z-10 h-[360px] w-[min(900px,100%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#39c7d4]/25 blur-[100px] sm:h-[440px]"
      />

      {/* Centered hero content */}
      <div className="relative mx-auto flex min-h-[680px] max-w-5xl flex-col items-center justify-center px-5 pb-24 pt-16 text-center sm:min-h-[740px] sm:px-8 sm:pb-28 lg:min-h-[780px]">
        <div className="hero-enter inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.09] px-4 py-2 shadow-[0_0_24px_rgba(94,225,231,0.08)] backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[#a9e4e6] shadow-[0_0_12px_rgba(169,228,230,0.9)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.19em] text-white/90 sm:text-xs sm:tracking-[0.24em]">
            Healthcare, connected
          </span>
        </div>

        <h1 className="hero-enter delay-1 mt-7 max-w-4xl text-[clamp(2.5rem,6.4vw,5.5rem)] font-semibold leading-[1.04] tracking-[-0.055em] text-white">
          Care that fits your life.
          <span className="mt-2 block font-normal text-[#b8edef] [text-shadow:0_0_35px_rgba(103,225,232,0.25)]">
            Starts here.
          </span>
        </h1>

        <p className="hero-enter delay-2 mt-6 max-w-xl text-sm leading-7 text-white/85 sm:mt-7 sm:text-lg sm:leading-8">
          Find the right specialist, book with ease, and take care of your health with SmartCare.
        </p>

        <div className="hero-enter delay-3 mt-8 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/login"
            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#075c70] shadow-[0_0_24px_rgba(169,228,230,0.2),0_12px_35px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e8f8f8] hover:shadow-[0_0_34px_rgba(169,228,230,0.35),0_14px_38px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#075c70]"
          >
            Book an appointment
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/doctors"
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/45 bg-white/[0.08] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:border-white/80 hover:bg-white/15 hover:shadow-[0_0_24px_rgba(169,228,230,0.1)]"
          >
            Explore our doctors
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Trust points */}
        <div className="hero-enter delay-4 mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-white/85 sm:mt-12 sm:gap-x-8 sm:text-sm">
          <span className="inline-flex items-center gap-2">
            <Check size={15} className="text-[#b8edef] drop-shadow-[0_0_5px_rgba(184,237,239,0.55)]" />
            Find your specialist
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-white/50 sm:block" />
          <span className="inline-flex items-center gap-2">
            <CalendarCheck size={15} className="text-[#b8edef] drop-shadow-[0_0_5px_rgba(184,237,239,0.55)]" />
            Convenient appointments
          </span>
        </div>

        {/* Scroll cue */}
        <a
          href="#how-it-works"
          className="hero-enter delay-4 absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[9px] font-medium uppercase tracking-[0.2em] text-white/65 transition hover:text-white sm:bottom-7"
          aria-label="Scroll to learn how SmartCare works"
        >
          Scroll to explore
          <span className="h-7 w-px bg-gradient-to-b from-white/70 to-transparent" />
        </a>
      </div>

      {/* Gentle transition into the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f8fbfc]/20 to-transparent" />

      <style jsx>{`
        .hero-enter {
          animation: fadeUp 800ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }

        .delay-1 {
          animation-delay: 100ms;
        }

        .delay-2 {
          animation-delay: 220ms;
        }

        .delay-3 {
          animation-delay: 340ms;
        }

        .delay-4 {
          animation-delay: 460ms;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-enter {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
