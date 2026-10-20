
"use client";

import { AlertCircle, Stethoscope } from "lucide-react";
import { Doctor } from "./doctor";
import DoctorCard from "./DoctorCard";

type DoctorListProps = {
  doctors: Doctor[];
  loading?: boolean;
  error?: string | null;
};

function DoctorSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-2xl bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-slate-100" />
          <div className="h-3 w-1/2 rounded bg-slate-100" />
        </div>
      </div>
      <div className="my-5 h-px bg-slate-100" />
      <div className="h-14 rounded-xl bg-slate-100" />
      <div className="mt-5 h-11 rounded-xl bg-slate-100" />
    </div>
  );
}

export default function DoctorList({
  doctors,
  loading = false,
  error,
}: DoctorListProps) {
  if (loading) {
    return (
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3"
        aria-label="Loading doctors"
        aria-busy="true"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <DoctorSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-rose-200 bg-rose-50 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <div>
            <h3 className="font-semibold text-rose-900">
              Unable to load doctors
            </h3>
            <p className="mt-1 break-words text-sm leading-6 text-rose-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#C8E3EA] bg-white px-4 py-10 text-center sm:px-8 sm:py-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF7FB] text-[#0E7490]">
          <Stethoscope size={27} />
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-900">
          No doctors found
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          There are no doctors matching this selection right now. Try different
          symptoms or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
