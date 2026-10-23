
"use client";

import {
  HeartPulse,
  Brain,
  Stethoscope,
  Bone,
  Ear,
  Eye,
  Activity,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import type { ReactNode } from "react";

type SuggestedSpecialtyProps = {
  specialty: string;
};

const specialtyConfig: Record<
  string,
  { icon: ReactNode; description: string }
> = {
  Cardiology: {
    icon: <HeartPulse size={28} strokeWidth={1.8} />,
    description:
      "Cardiology specialists assess conditions involving the heart and circulatory system.",
  },
  Neurology: {
    icon: <Brain size={28} strokeWidth={1.8} />,
    description:
      "Neurology specialists assess conditions involving the brain, nerves, and nervous system.",
  },
  Dermatology: {
    icon: <Sparkles size={28} strokeWidth={1.8} />,
    description:
      "Dermatology specialists assess conditions involving the skin, hair, and nails.",
  },
  Orthopedics: {
    icon: <Bone size={28} strokeWidth={1.8} />,
    description:
      "Orthopedic specialists assess conditions involving bones, joints, muscles, and ligaments.",
  },
  ENT: {
    icon: <Ear size={28} strokeWidth={1.8} />,
    description:
      "ENT specialists assess conditions involving the ears, nose, and throat.",
  },
  Ophthalmology: {
    icon: <Eye size={28} strokeWidth={1.8} />,
    description:
      "Ophthalmology specialists assess conditions involving the eyes and vision.",
  },
  Gastroenterology: {
    icon: <Activity size={28} strokeWidth={1.8} />,
    description:
      "Gastroenterology specialists assess conditions involving the digestive system.",
  },
  Pulmonology: {
    icon: <Activity size={28} strokeWidth={1.8} />,
    description:
      "Pulmonology specialists assess conditions involving the lungs and respiratory system.",
  },
};

export default function SuggestedSpecialty({
  specialty,
}: SuggestedSpecialtyProps) {
  const config = specialtyConfig[specialty] ?? {
    icon: <Stethoscope size={28} strokeWidth={1.8} />,
    description: `Explore doctors listed under ${specialty} to learn more about their specialty.`,
  };

  return (
    <section
      aria-labelledby="suggested-specialty-heading"
      className="relative isolate overflow-hidden rounded-3xl border border-[#D8EBF0] bg-white shadow-[0_8px_30px_rgba(7,92,112,0.07)]"
    >
      {/* Subtle decorative background */}
      <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-56 w-56 rounded-full bg-[#DDF4F8]/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 -z-10 h-40 w-40 rounded-full bg-[#EFF9FB] blur-3xl" />

      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#075C70] via-[#0E8498] to-cyan-200" />

      <div className="relative p-5 sm:p-7 lg:p-8">
        {/* Recommendation content */}
        <div className="mt-6 flex min-w-0 flex-col gap-5 sm:mt-7 sm:flex-row sm:items-start sm:gap-6">
          {/* Specialty icon */}
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center self-start rounded-2xl bg-gradient-to-br from-[#075C70] to-[#0E8498] text-white shadow-[0_8px_18px_rgba(7,92,112,0.20)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(7,92,112,0.25)] sm:h-[76px] sm:w-[76px] sm:rounded-3xl">
            <div className="absolute inset-1.5 rounded-[0.9rem] border border-white/15 sm:rounded-[1.15rem]" />
            <span className="relative">{config.icon}</span>
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#0E7490]">
              Based on your description
            </p>

            <h2
              id="suggested-specialty-heading"
              className="mt-2 break-words text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl"
            >
              {specialty}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              {config.description}
            </p>

            <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-[#F0FAFC] p-3.5 sm:p-4">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-[#0E7490]"
              />
              <p className="text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                This suggestion is based on symptom keywords, not a medical
                diagnosis. A qualified healthcare professional can assess your
                symptoms and determine appropriate care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
