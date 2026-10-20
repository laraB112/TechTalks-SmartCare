
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Loader2,
  HeartPulse,
  RotateCcw,
  Info,
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
  const [suggestedSpecialty, setSuggestedSpecialty] = useState<string | null>(
    null
  );
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
      setNotice("Enter a few details about your symptoms to get started.");
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
      setNotice(
        filteredDoctors.length === 0
          ? `No doctors are currently listed under ${matchedSpecialty.name}. You can browse all available doctors below.`
          : ""
      );

      if (filteredDoctors.length === 0) {
        setDoctors(allDoctors);
      }
    } else {
      setSuggestedSpecialty(null);
      setDoctors(allDoctors);
      setNotice("");
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
    <main className="min-w-0 space-y-6 sm:space-y-7">
      {/* Intro */}
      <section className="rounded-2xl bg-[#075C70] p-5 text-white sm:p-6 lg:p-7">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-100">
            Personalized guidance
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Find the Right Doctor
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-50 sm:text-base">
            Describe what you're experiencing and explore doctors whose specialty
            may be relevant to your symptoms.
          </p>
        </div>
      </section>
      {/* Symptom form */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 lg:p-8">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Describe Your Symptoms
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            Include what you feel, where you feel it, and any relevant details.
            Avoid including personal information you don't need to share.
          </p>
        </div>

        <label
          htmlFor="symptom-description"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          What are you experiencing?
        </label>

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
          rows={5}
          className="min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0E7490] focus:bg-white focus:ring-4 focus:ring-[#0E7490]/10 sm:text-base"
        />

        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-400">
          <span>Be as clear and specific as you can.</span>
          <span className="shrink-0 tabular-nums">{symptoms.length}/1500</span>
        </div>

        {notice && !hasSearched && (
          <div
            role="status"
            className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-amber-800"
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{notice}</p>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#075C70] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064B5B] focus:outline-none focus:ring-4 focus:ring-[#0E7490]/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-52"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Loading doctors...
              </>
            ) : (
              <>
                <Search size={18} />
                Find the Right Doctor
              </>
            )}
          </button>

          {(hasSearched || symptoms || notice) && (
            <button
              type="button"
              onClick={handleReset}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-[#B9DFE8] hover:bg-[#F1FAFC] hover:text-[#075C70] focus:outline-none focus:ring-4 focus:ring-[#0E7490]/10"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          )}
        </div>

        <div className="mt-5 flex items-start gap-2 border-t border-slate-100 pt-4">
          <Info size={16} className="mt-0.5 shrink-0 text-[#0E7490]" />
          <p className="text-xs leading-5 text-slate-500">
            This tool matches keywords to specialties; it does not diagnose
            medical conditions. If you have severe or sudden symptoms, seek
            urgent medical care instead of waiting for an online recommendation.
          </p>
        </div>
      </section>

      {/* API error */}
      {error && (
        <section
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-5"
        >
          <p className="font-semibold text-rose-900">
            Couldn't retrieve the doctors
          </p>
          <p className="mt-1 text-sm leading-6 text-rose-700">{error}</p>

          <button
            type="button"
            onClick={() => void fetchAllDoctors()}
            className="mt-3 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            Try again
          </button>
        </section>
      )}

      {/* Recommendation */}
      {suggestedSpecialty && !error && (
        <SuggestedSpecialty specialty={suggestedSpecialty} />
      )}

      {/* Unmatched keywords */}
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

      {/* Doctors */}
      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              {suggestedSpecialty ? "Recommended Doctors" : "Explore Our Doctors"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? "Retrieving doctor information..."
                : `${doctors.length} ${doctors.length === 1 ? "doctor" : "doctors"} available in this list`}
            </p>
          </div>
        </div>

        <DoctorList
          doctors={doctors}
          loading={loading}
          error={error || null}
        />
      </section>
    </main>
  );
}
