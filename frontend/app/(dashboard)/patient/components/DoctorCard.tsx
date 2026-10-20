
"use client";

import { Briefcase, CalendarPlus, ArrowUpRight, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { Doctor } from "./doctor";

type DoctorCardProps = {
  doctor: Doctor;
};

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const router = useRouter();

  const handleBookAppointment = () => {
    router.push(
      `/patient/dashboard/book-appointment?doctorId=${doctor.id}`
    );
  };

  const experience = Number(doctor.experience) || 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B9DFE8] hover:shadow-xl hover:shadow-[#075C70]/[0.08]">
      <div className="h-1.5 bg-gradient-to-r from-[#075C70] via-[#0E7490] to-[#57C5D0]" />

      <div className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF7FB] text-[#075C70] transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
            <Stethoscope size={25} strokeWidth={1.8} />
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="break-words text-base font-bold leading-snug text-slate-900 sm:text-lg">
              Dr. {doctor.name || "Unknown"}
            </h3>

            <span className="mt-2 inline-flex max-w-full rounded-full border border-[#D7EDF2] bg-[#F1FAFC] px-2.5 py-1 text-xs font-semibold text-[#075C70] sm:text-sm">
              <span className="truncate">
                {doctor.specialty || "General"}
              </span>
            </span>
          </div>
        </div>

        <div className="my-5 h-px bg-slate-100" />

        <div className="mb-5 flex items-center gap-3 rounded-xl bg-slate-50/80 px-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#0E7490] shadow-sm">
            <Briefcase size={17} />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-500">Professional experience</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-800">
              {experience} {experience === 1 ? "year" : "years"}
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <button
            type="button"
            onClick={handleBookAppointment}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#075C70] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#064B5B] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#0E7490]/20 active:scale-[0.98]"
          >
            <CalendarPlus size={18} />
            Book Appointment
            <ArrowUpRight
              size={16}
              className="ml-auto transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </article>
  );
}
