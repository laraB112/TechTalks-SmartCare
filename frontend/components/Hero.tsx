
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Check } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const stats = [
  { number: 50000, title: "Happy patients", suffix: "+" },
  { number: 150, title: "Specialist doctors", suffix: "+" },
  { number: 98, title: "Patient satisfaction", suffix: "%" },
];

const journey = [
  { number: "01", title: "Find your specialty" },
  { number: "02", title: "Choose your doctor" },
  { number: "03", title: "Book your visit" },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#fbfdff]">
      {/* Soft atmospheric background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_38%,rgba(186,230,245,0.42),transparent_42%),linear-gradient(120deg,#ffffff_8%,#fbfdff_58%,#f0f9fc_100%)]" />

      <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-2 px-3 py-8 sm:gap-6 sm:px-8 sm:py-12 lg:min-h-[690px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-0 lg:px-12 lg:py-12">
        {/* Copy */}
        <div className="relative z-20 min-w-0">
          <div className="hero-enter mb-3 flex items-center gap-2 sm:mb-7 sm:gap-3">
            <span className="h-px w-5 shrink-0 bg-[#0e7490] sm:w-9" />
            <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#0e7490] sm:text-xs sm:tracking-[0.22em]">
              Healthcare, connected
            </span>
          </div>

          <h1 className="hero-enter delay-1 text-[clamp(1.65rem,5.8vw,4.25rem)] font-semibold leading-[1.08] tracking-[-0.05em] text-slate-950">
            Care that
            <br />
            fits your life.
            <br />
            <span className="font-normal text-[#0e7490]">
              Starts here.
            </span>
          </h1>

          <p className="hero-enter delay-2 mt-3 max-w-[455px] text-[11px] leading-[1.7] text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
            Your health journey shouldn't be complicated. Find the right
            specialist, choose a convenient time, and take the next step
            with SmartCare.
          </p>

          <div className="hero-enter delay-3 mt-4 flex flex-col items-stretch gap-2 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
            <Link
              href="/login"
              className="group inline-flex min-h-0 items-center justify-center gap-1.5 rounded-lg bg-[#075c70] px-2 py-2.5 text-[10px] font-semibold leading-tight text-white shadow-[0_8px_24px_rgba(7,92,112,0.15)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#064c5d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2 sm:min-h-14 sm:gap-3 sm:rounded-xl sm:px-6 sm:py-4 sm:text-sm"
            >
              Book appointment
              <ArrowRight
                size={14}
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:h-4 sm:w-4"
              />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-lg px-1 py-2 text-[10px] font-semibold leading-tight text-slate-700 transition hover:bg-white/80 hover:text-[#0e7490] sm:min-h-14 sm:rounded-xl sm:px-5 sm:py-4 sm:text-sm"
            >
              Discover SmartCare
            </Link>
          </div>

          {/* Three simple steps: compact on mobile */}
          <div className="hero-enter delay-4 mt-5 border-t border-slate-200 pt-3 sm:mt-14 sm:max-w-[560px] sm:pt-6">
            <p className="mb-3 text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:mb-5 sm:text-[11px] sm:tracking-[0.18em]">
              A simpler way to get care
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-5">
              {journey.map((step) => (
                <div key={step.number} className="flex items-start gap-2 sm:block">
                  <span className="text-[9px] font-medium text-[#0e7490] sm:text-xs">
                    {step.number}
                  </span>
                  <p className="text-[10px] font-semibold leading-4 text-slate-800 sm:mt-2 sm:text-sm sm:leading-5">
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hospital image: stays beside text on mobile */}
        <div className="relative z-10 min-w-0 self-center">
          <div className="pointer-events-none absolute inset-x-[5%] bottom-[8%] top-[8%] rounded-[45%] bg-cyan-100/50 blur-2xl sm:blur-3xl" />

          <div className="relative h-[240px] w-full min-[400px]:h-[285px] sm:h-[470px] lg:h-[610px]">
            <Image
              src="/images/bg6.jpg"
              alt="Bright, modern hospital interior"
              fill
              priority
              sizes="(max-width: 639px) 48vw, (max-width: 1024px) 45vw, 48vw"
              className="hospital-image object-cover object-center"
            />

            {/* Blend image edges into the page */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#fbfdff_0%,rgba(251,253,255,0.22)_15%,transparent_45%,transparent_80%,rgba(240,249,252,0.2)_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,#fbfdff_0%,transparent_18%,transparent_78%,#fbfdff_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(251,253,255,0.35)_100%)]" />
          </div>

          {/* Floating card 1 */}
          <div className="float-card absolute left-[-5px] top-[12%] z-10 max-w-[145px] rounded-xl border border-white/80 bg-white/90 p-2 shadow-[0_10px_30px_rgba(15,70,90,0.11)] backdrop-blur-xl min-[400px]:left-0 min-[400px]:max-w-none min-[400px]:p-3 sm:left-1 sm:rounded-2xl sm:p-5">
            <p className="text-[9px] text-slate-500 sm:text-xs">
              Your next step
            </p>
            <div className="mt-1.5 flex items-center gap-2 sm:mt-2 sm:gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#eaf6fa] text-[#075c70] sm:h-10 sm:w-10 sm:rounded-xl">
                <CalendarCheck size={15} className="sm:h-[19px] sm:w-[19px]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-slate-900 sm:text-sm">
                  Book with ease
                </p>
                <p className="mt-0.5 hidden text-xs text-slate-500 min-[400px]:block">
                  At a time that suits you
                </p>
              </div>
            </div>
          </div>

          {/* Floating card 2 */}
          <div className="float-card float-delay absolute bottom-[16%] right-[-5px] z-10 max-w-[155px] rounded-xl border border-white/80 bg-white/90 p-2 shadow-[0_10px_30px_rgba(15,70,90,0.12)] backdrop-blur-xl min-[400px]:right-0 min-[400px]:max-w-[190px] min-[400px]:p-3 sm:bottom-[19%] sm:right-1 sm:max-w-[235px] sm:rounded-2xl sm:p-5">
            <p className="text-[9px] text-slate-500 sm:text-xs">
              Made for your wellbeing
            </p>
            <p className="mt-1 text-[11px] font-semibold tracking-tight text-slate-900 sm:mt-2 sm:text-base">
              Better access to care.
            </p>
            <div className="mt-2 flex items-center gap-1.5 border-t border-slate-100 pt-2 text-[9px] text-slate-500 sm:mt-3 sm:gap-2 sm:pt-3 sm:text-xs">
              <Check size={12} className="shrink-0 text-[#0e7490] sm:h-[14px] sm:w-[14px]" />
              <span>A simpler patient experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust statistics */}
      <div className="border-t border-slate-200/70 bg-white/75">
        <div className="mx-auto grid max-w-7xl grid-cols-3 px-2 py-4 sm:px-8 sm:py-7 lg:px-12">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className={`px-1 text-center sm:px-6 ${
                index !== 0 ? "border-l border-slate-200" : ""
              }`}
            >
              <p className="text-lg font-semibold tracking-tight text-[#075c70] sm:text-3xl">
                <AnimatedCounter
                  target={stat.number}
                  duration={2200}
                  suffix={stat.suffix}
                />
              </p>
              <p className="mt-1 text-[9px] leading-3 text-slate-500 sm:mt-1.5 sm:text-sm sm:leading-5">
                {stat.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hero-enter {
          animation: fadeUp 850ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
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

        .hospital-image {
          -webkit-mask-image: radial-gradient(
            ellipse 82% 78% at 52% 47%,
            #000 45%,
            rgba(0, 0, 0, 0.92) 65%,
            transparent 100%
          );
          mask-image: radial-gradient(
            ellipse 82% 78% at 52% 47%,
            #000 45%,
            rgba(0, 0, 0, 0.92) 65%,
            transparent 100%
          );
          animation: imageReveal 1.4s ease-out both;
        }

        .float-card {
          animation: float 6s ease-in-out infinite;
        }

        .float-delay {
          animation-delay: -2.5s;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes imageReveal {
          from {
            opacity: 0;
            transform: scale(1.025);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-enter,
          .hospital-image,
          .float-card {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
