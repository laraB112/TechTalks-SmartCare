"use client";

import { CalendarPlus, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Doctor } from "./doctor";
import { specialties } from "./specialties";

type DoctorCardProps = {
  doctor: Doctor;
};

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const router = useRouter();
  const experience = Number(doctor.experience) || 0;

  const doctorName = doctor.name || "Unknown";
  const doctorSpecialty = doctor.specialty?.trim() || "General";

  const matchedSpecialty = specialties.find(
    (specialty) =>
      specialty.name.toLowerCase() === doctorSpecialty.toLowerCase()
  );

  const specialtyImage = matchedSpecialty?.icon || "/images/stethoscope.png";

  const handleBookAppointment = () => {
    router.push(
      `/ patient / dashboard / book - appointment ? doctorId = ${ encodeURIComponent(String(doctor.id)) } `
    );
  };

  return (
    <article
      className="
        group relative flex h-full min-w-0 flex-col overflow-hidden
        rounded-2xl border border-white/80 bg-white
        p-2.5
        shadow-[0_4px_14px_rgba(7,92,112,0.10)]
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:scale-[1.02]
        hover:border-[#B9DFE8]
        hover:shadow-[0_14px_30px_rgba(7,92,112,0.17)]
        active:scale-[0.98]
        sm:rounded-2xl sm:p-5
        sm:shadow-[0_3px_12px_rgba(7,92,112,0.06)]
        sm:hover:-translate-y-1.5 sm:hover:scale-[1.015]
      "
    >
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#075C70] via-[#20A5B5] to-[#B8E7EC] opacity-90" />

      {/* Specialty image */}
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#E4F6F8] to-[#C9EAF0] transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-110 sm:mb-3 sm:h-10 sm:w-10">
        <Image
          src={specialtyImage}
          alt={`${ doctorSpecialty } icon`}
          width={24}
          height={24}
          className="h-4 w-4 object-contain sm:h-5 sm:w-5"
        />
      </div>

      <div className="min-w-0 pt-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#0E7490] sm:text-[10px] sm:tracking-[0.12em]">
          Medical specialist
        </p>

        <h3 className="mt-1.5 break-words text-sm font-bold leading-snug text-slate-900 sm:mt-2 sm:text-lg">
          Dr. {doctorName}
        </h3>

        <div className="mt-2 min-h-8 sm:mt-3">
          <span className="inline-block max-w-full rounded-lg border border-[#D9EFF3] bg-[#EFF9FB] px-1.5 py-1 text-[10px] font-semibold leading-snug text-[#075C70] [overflow-wrap:anywhere] sm:px-2.5 sm:py-1.5 sm:text-xs">
            {doctorSpecialty}
          </span>
        </div>
      </div>

      <div className="my-3 h-px bg-gradient-to-r from-transparent via-[#DCEEF3] to-transparent sm:my-5" />

      {/* Experience */}
      <div className="mb-3 flex min-w-0 items-center gap-1.5 sm:mb-5 sm:gap-2.5">
        <div className="min-w-0">
          <p className="text-[9px] leading-tight text-slate-500 sm:text-xs">
            Experience
          </p>

          <p className="mt-1 break-words text-xs font-bold leading-tight text-slate-800 sm:text-sm">
            {experience} {experience === 1 ? "year" : "years"}
          </p>
        </div>
      </div>

      {/* Booking button */}
      <button
        type="button"
        onClick={handleBookAppointment}
        aria-label={`Book an appointment with Dr.${ doctorName } `}
        className="
          group/button relative mt-auto flex min-h-10 w-full min-w-0
          items-center justify-center gap-1 overflow-hidden rounded-xl
          bg-gradient-to-r from-[#075C70] to-[#0E8498]
          px-1.5 py-2 text-[10px] font-bold leading-tight text-white
          shadow-[0_4px_10px_rgba(7,92,112,0.20)]
          transition-all duration-300
          hover:from-[#064B5B] hover:to-[#076B80]
          hover:shadow-[0_6px_16px_rgba(7,92,112,0.32)]
          focus:outline-none focus:ring-2 focus:ring-[#0E7490]/40 focus:ring-offset-2
          active:scale-[0.96]
          sm:min-h-11 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-sm
        "
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover/button:translate-x-full" />

        <CalendarPlus className="relative h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />

        <span className="relative text-center">Book appointment</span>

        <ArrowUpRight className="relative hidden h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5 sm:block" />
      </button>
    </article>
  );
}
