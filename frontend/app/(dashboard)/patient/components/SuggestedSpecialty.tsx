
import {
  HeartPulse,
  Brain,
  Stethoscope,
  Bone,
  Ear,
  Eye,
  ScanHeart,
  Activity,
  ShieldCheck,
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
    icon: <HeartPulse size={27} />,
    description:
      "Cardiology specialists assess conditions involving the heart and circulatory system.",
  },
  Neurology: {
    icon: <Brain size={27} />,
    description:
      "Neurology specialists assess conditions involving the brain, nerves, and nervous system.",
  },
  Dermatology: {
    icon: <Stethoscope size={27} />,
    description:
      "Dermatology specialists assess conditions involving the skin, hair, and nails.",
  },
  Orthopedics: {
    icon: <Bone size={27} />,
    description:
      "Orthopedic specialists assess conditions involving bones, joints, muscles, and ligaments.",
  },
  ENT: {
    icon: <Ear size={27} />,
    description:
      "ENT specialists assess conditions involving the ears, nose, and throat.",
  },
  Ophthalmology: {
    icon: <Eye size={27} />,
    description:
      "Ophthalmology specialists assess conditions involving the eyes and vision.",
  },
  Gastroenterology: {
    icon: <ScanHeart size={27} />,
    description:
      "Gastroenterology specialists assess conditions involving the digestive system.",
  },
  Pulmonology: {
    icon: <Activity size={27} />,
    description:
      "Pulmonology specialists assess conditions involving the lungs and respiratory system.",
  },
};

export default function SuggestedSpecialty({
  specialty,
}: SuggestedSpecialtyProps) {
  const config = specialtyConfig[specialty] ?? {
    icon: <Stethoscope size={27} />,
    description: `Explore doctors listed under ${specialty} to learn more about their specialty.`,
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#CFE7ED] bg-gradient-to-br from-[#F0FAFC] via-white to-white p-5 shadow-sm sm:p-6 lg:p-7">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#EAF7FB]/70 blur-2xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0E7490] shadow-sm ring-1 ring-[#D9EDF2]">
          {config.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-[#0E7490]">
            <ShieldCheck size={15} />
            Symptom guide
          </div>

          <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Suggested Specialty
          </h3>

          <p className="mt-2 break-words text-base font-semibold text-[#075C70] sm:text-lg">
            {specialty}
          </p>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            {config.description}
          </p>

          <p className="mt-4 border-t border-[#D9EDF2] pt-3 text-xs leading-5 text-slate-500 sm:text-sm">
            This is general guidance based on the keywords in your description,
            not a medical diagnosis. A qualified healthcare professional can
            assess your symptoms and determine appropriate care.
          </p>
        </div>
      </div>
    </section>
  );
}
