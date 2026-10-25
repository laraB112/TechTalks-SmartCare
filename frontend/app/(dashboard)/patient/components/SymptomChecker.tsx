"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Search,
  Loader2,
  RotateCcw,
  Info,
  CircleHelp,
  ArrowDown,
  Users,
  ShieldCheck,

} from "lucide-react";

import DoctorList from "./DoctorList";
import EmptyState from "./EmptyState";
import SuggestedSpecialty from "./SuggestedSpecialty";
import { Doctor } from "./doctor";
import { specialties, Specialty } from "./specialties";

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [suggestedSpecialty, setSuggestedSpecialty] =
    useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const fetchAllDoctors = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://TechTalks-SmartCare.test/api/doctors",
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const doctorsData = data.data || [];

      const mappedDoctors: Doctor[] = doctorsData.map((doctor: any) => ({
        id: doctor.id,
        name: doctor.name || doctor.user?.name || "Unknown",
        specialty: doctor.specialization?.name || "General",
        experience: doctor.experience_years || 0,
        rating: doctor.rating || 0,
        consultation_fee: doctor.consultation_fee || 0,
        is_available: doctor.is_available,
        profile_photo: doctor.profile_photo,
      }));

      setAllDoctors(mappedDoctors);
      setDoctors(mappedDoctors);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("We couldn't load the doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAllDoctors();
  }, [fetchAllDoctors]);

  const getMatchingSpecialty = (text: string): Specialty | null => {
    const normalizedText = text.toLowerCase();

    for (const specialty of specialties) {
      for (const keyword of specialty.keywords) {
        if (normalizedText.includes(keyword.toLowerCase())) {
          return specialty;
        }
      }
    }

    return null;
  };

  const handleSearch = () => {
    setError("");
    setNotice("");
    setHasSearched(true);

    if (!symptoms.trim()) {
      setDoctors(allDoctors);
      setSuggestedSpecialty(null);
      setHasSearched(false);
      setNotice(
        "Describe your symptoms first so we can suggest a specialty."
      );
      return;
    }

    const matchedSpecialty = getMatchingSpecialty(symptoms);

    if (matchedSpecialty) {
      const filteredDoctors = allDoctors.filter(
        (doctor) =>
          doctor.specialty.trim().toLowerCase() ===
          matchedSpecialty.name.trim().toLowerCase()
      );

      setSuggestedSpecialty(matchedSpecialty.name);
      setDoctors(filteredDoctors);

      if (filteredDoctors.length === 0) {
        setNotice(
          `No doctors are currently listed under ${matchedSpecialty.name}. Browse the other doctors below.`
        );
        setDoctors(allDoctors);
      }
    } else {
      setSuggestedSpecialty(null);
      setDoctors(allDoctors);
    }
  };

  const handleReset = () => {
    setSymptoms("");
    setDoctors(allDoctors);
    setSuggestedSpecialty(null);
    setError("");
    setNotice("");
    setHasSearched(false);
  };

  const unmatchedSymptoms =
    hasSearched && symptoms.trim() !== "" && !suggestedSpecialty;

  return (
    <main className="mx-auto w-full min-w-0 max-w-[1500px] space-y-8 pb-8 sm:space-y-10">

      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-[#064B5B] via-[#075C70] to-[#0E8498] text-white shadow-[0_8px_24px_rgba(7,92,112,0.13)] sm:rounded-3xl">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-12 -top-14 -z-10 h-40 w-40 rounded-full border border-white/[0.09] sm:-right-20 sm:-top-24 sm:h-80 sm:w-80" />
        <div className="pointer-events-none absolute -right-8 top-8 -z-10 h-32 w-32 rounded-full bg-cyan-300/[0.10] blur-3xl sm:-right-10 sm:top-10 sm:h-64 sm:w-64" />
        <div className="pointer-events-none absolute -bottom-16 left-1/4 h-40 w-40 bg-teal-300/[0.10] blur-3xl sm:-bottom-28 sm:h-64 sm:w-64" />

        <div className="relative grid min-w-0 grid-cols-[minmax(0,1fr)_100px] items-center gap-1 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_180px] sm:gap-4 sm:px-8 sm:py-8 md:grid-cols-[minmax(0,1fr)_minmax(160px,0.65fr)] md:gap-4 lg:gap-8 lg:px-12 lg:py-10">

          {/* Hero text */}
          <div className="relative z-10 min-w-0">
            <h1 className="max-w-xl text-xl font-bold leading-snug tracking-tight sm:text-3xl lg:text-[2.75rem] lg:leading-tight">
              Find the right doctor for{" "}
              <span className="text-cyan-200">your needs.</span>
            </h1>

            <p className="mt-2 max-w-md text-xs leading-5 text-cyan-50/85 sm:mt-3 sm:text-sm sm:leading-6 lg:text-base">
              Describe your symptoms to find the right specialty.
            </p>

            <button
              type="button"
              onClick={() =>
                document.getElementById("symptom-description")?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                })
              }
              className="mt-4 inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-[#075C70] shadow-md transition hover:-translate-y-0.5 hover:bg-cyan-50 focus:outline-none focus:ring-4 focus:ring-white/30 active:scale-[0.98] sm:mt-5 sm:min-h-11 sm:gap-2.5 sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Check your symptoms
              <ArrowDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>

            <div className="mt-3 flex items-center gap-1.5 text-[10px] leading-4 text-cyan-50/75 sm:mt-4 sm:gap-2 sm:text-xs">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-cyan-200 sm:h-4 sm:w-4" />
              <span>Guidance to help you take the next step.</span>
            </div>
          </div>

          {/* Floating medical illustration */}
          <div className="relative mx-auto flex w-full min-w-0 items-center justify-center sm:max-w-[180px] md:max-w-none">
            {/* Glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/20 blur-2xl sm:h-40 sm:w-40 lg:h-52 lg:w-52" />

            {/* Outer circle */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.12] sm:h-44 sm:w-44 lg:h-56 lg:w-56" />

            {/* Inner decorative circle */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-100/25 sm:h-32 sm:w-32 lg:h-40 lg:w-40" />

            {/* Decorative dots */}
            <span className="pointer-events-none absolute right-1 top-[20%] h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(165,243,252,0.7)] sm:right-3 sm:h-3 sm:w-3" />
            <span className="pointer-events-none absolute bottom-[18%] left-1 h-1.5 w-1.5 rounded-full bg-white/80 sm:left-3 sm:h-2 sm:w-2" />

            {/* Animated image */}
            <div className="float-animation relative h-24 w-24 sm:h-40 sm:w-40 lg:h-56 lg:w-56">
              <Image
                src="/images/dash3.png"
                alt="Medical illustration for the SmartCare symptom checker"
                fill
                sizes="(max-width: 639px) 96px, (max-width: 1023px) 160px, 224px"
                className="object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.14)]"
                priority
              />
            </div>
          </div>

        </div>
      </section>

      {/* Symptom form */}
      <section className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-[#075C70] via-[#08758A] to-[#0E7490] p-1.5 text-white sm:rounded-3xl sm:p-2 md:p-2.5">
        {/* Subtle background decoration */}
        <div className="pointer-events-none absolute -right-12 -top-12 -z-0 h-40 w-40 rounded-full border border-white/[0.08] sm:h-64 sm:w-64" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 -z-0 h-40 w-40 rounded-full bg-cyan-300/[0.10] blur-3xl sm:h-56 sm:w-56" />

        {/* Form card */}
        <div className="relative z-10 overflow-hidden rounded-[calc(1rem-2px)] bg-white shadow-sm sm:rounded-[calc(1.5rem-4px)]">
          {/* Header */}
          <div className="border-b border-slate-100/80 bg-gradient-to-r from-[#F0FAFC] via-white to-white px-4 py-4 sm:px-7 sm:py-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#075C70] to-[#0E8498] text-white shadow-sm shadow-cyan-900/15 sm:h-12 sm:w-12 sm:rounded-2xl">
                <CircleHelp className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  Tell us how you feel
                </h2>
              
              </div>
            </div>
          </div>

          {/* Form body */}
          <div className="p-4 sm:p-6 lg:p-7">
            <label
              htmlFor="symptom-description"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Describe your symptoms
            </label>

            <div className="relative">
              <textarea
                id="symptom-description"
                value={symptoms}
                onChange={(event) => setSymptoms(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    (event.ctrlKey || event.metaKey) &&
                    event.key === "Enter" &&
                    !loading
                  ) {
                    handleSearch();
                  }
                }}
                maxLength={1500}
                placeholder="For example: I've had a persistent cough and shortness of breath..."
                rows={4}
                className="min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3.5 text-sm leading-6 text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0E8498] focus:bg-white focus:ring-4 focus:ring-[#0E8498]/10 sm:min-h-36 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-base"
              />

              <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-white/90 px-2 py-1 text-[10px] font-medium tabular-nums text-slate-400 sm:text-xs">
                {symptoms.length}/1500
              </div>
            </div>

            {/* Input guidance */}
            <div className="mt-2 flex flex-col gap-1 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Be clear and specific. Avoid unnecessary personal details.
              </span>
              <span className="hidden sm:inline">
                Tip: Press Ctrl + Enter to search.
              </span>
            </div>

            {/* Notice */}
            {notice && !hasSearched && (
              <div
                role="status"
                className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm leading-5 text-amber-900"
              >
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{notice}</p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleSearch}
                disabled={loading}
                className="group relative flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#075C70] to-[#0E8498] px-5 py-3 text-sm font-bold text-white shadow-[0_4px_12px_rgba(7,92,112,0.15)] transition duration-200 hover:-translate-y-0.5 hover:from-[#064B5B] hover:to-[#08768A] hover:shadow-[0_7px_16px_rgba(7,92,112,0.20)] focus:outline-none focus:ring-4 focus:ring-[#0E8498]/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-52"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                {loading ? (
                  <>
                    <Loader2 size={18} className="relative animate-spin" />
                    <span className="relative">Loading doctors...</span>
                  </>
                ) : (
                  <>
                    <Search size={18} className="relative" />
                    <span className="relative">Find the right doctor</span>
                  </>
                )}
              </button>

              {(hasSearched || symptoms || notice) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition duration-200 hover:border-[#B9DFE8] hover:bg-[#F0FAFC] hover:text-[#075C70] focus:outline-none focus:ring-4 focus:ring-[#0E8498]/10 active:scale-[0.98] sm:w-auto"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              )}
            </div>

            {/* Disclaimer */}
            <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-[#F5F9FA] px-3.5 py-3 sm:px-4">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#0E7490]" />
              <p className="text-xs leading-5 text-slate-500 sm:text-[13px]">
                <span className="font-semibold text-slate-700">
                  Please note:
                </span>{" "}
                This tool suggests specialties, not diagnoses.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* API error with retry */}
      {error && (
        <section
          role="alert"
          className="flex flex-col gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="min-w-0">
            <p className="font-semibold text-rose-900">
              Couldn't retrieve the doctors
            </p>
            <p className="mt-1 text-sm leading-6 text-rose-700">{error}</p>
          </div>

          <button
            type="button"
            onClick={() => void fetchAllDoctors()}
            className="flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 focus:outline-none focus:ring-4 focus:ring-rose-200/50"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
        </section>
      )}

      {/* Recommendation */}
      {!error && suggestedSpecialty && (
        <div className="animate-[fadeIn_.3s_ease-out]">
          <SuggestedSpecialty specialty={suggestedSpecialty} />
        </div>
      )}

      {/* Unmatched symptoms */}
      {unmatchedSymptoms && !loading && !error && <EmptyState />}

      {/* No doctors under matched specialty */}
      {notice && hasSearched && suggestedSpecialty && !error && (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
        >
          {notice}
        </div>
      )}

      {/* Doctor results */}
      {!error && (
        <section className="min-w-0 space-y-4 sm:space-y-5">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-gradient-to-b from-[#0E8498] to-[#075C70]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#0E7490] sm:text-xs">
                  Your care team
                </p>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {suggestedSpecialty
                  ? "Recommended Doctors"
                  : "Explore Our Doctors"}
              </h2>


            </div>

            <div className="flex w-fit shrink-0 items-center gap-2 rounded-xl border border-[#DCEEF3] bg-white px-3.5 py-2 shadow-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAF7FB] text-[#075C70]">
                <Users className="h-3.5 w-3.5" />
              </div>

              <div>
                <p className="text-sm font-bold leading-tight tabular-nums text-slate-800">
                  {loading ? "..." : doctors.length}
                </p>
                <p className="mt-0.5 text-[10px] leading-tight text-slate-500">
                  {doctors.length === 1 ? "Doctor listed" : "Doctors listed"}
                </p>
              </div>
            </div>
          </div>

          <DoctorList doctors={doctors} loading={loading} />
        </section>
      )}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        .float-animation {
          animation: float 3.5s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .float-animation {
            animation: none;
            will-change: auto;
          }

          :global(*) {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}