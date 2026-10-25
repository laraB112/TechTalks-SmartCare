"use client";

import { AlertCircle } from "lucide-react";
import type { Doctor } from "./doctor";
import DoctorCard from "./DoctorCard";

type DoctorListProps = {
  doctors: Doctor[];
  loading?: boolean;
  error?: string | null;
};

function DoctorSkeleton() {
  return (
    <div className="min-w-0 animate-pulse rounded-xl border border-slate-200 bg-white p-2 sm:rounded-2xl sm:p-5">
      <div className="h-3 w-12 rounded bg-slate-100 sm:w-20" />
      <div className="mt-3 h-4 w-full rounded bg-slate-200 sm:mt-4 sm:h-5" />
      <div className="mt-2 h-3 w-3/4 rounded bg-slate-100 sm:h-4" />
      <div className="my-3 h-px bg-slate-100 sm:my-5" />
      <div className="h-8 rounded-lg bg-slate-100 sm:h-12 sm:rounded-xl" />
      <div className="mt-3 h-8 rounded-lg bg-slate-200 sm:mt-4 sm:h-10 sm:rounded-xl" />
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
        className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3"
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
        className="flex min-w-0 items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-5"
      >
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
        <div className="min-w-0">
          <h3 className="font-semibold text-rose-900">
            Unable to load doctors
          </h3>
          <p className="mt-1 break-words text-sm leading-6 text-rose-700">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center sm:px-5 sm:py-10">
        <h3 className="text-base font-semibold text-slate-800 sm:text-lg">
          No doctors found
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          No doctors match this selection right now. Try different symptoms or
          check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-2 items-stretch gap-3 sm:gap-4 lg:grid-cols-3">
      {doctors.map((doctor) => (
        <div key={doctor.id} className="min-w-0">
          <DoctorCard doctor={doctor} />
        </div>
      ))}
    </div>
  );
}
