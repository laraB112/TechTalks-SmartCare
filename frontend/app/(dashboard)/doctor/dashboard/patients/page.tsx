"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserRound,
  Phone,
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
  Search,
  Mail,
  Stethoscope,
  RefreshCw,
  X,
  UserCircle,
} from "lucide-react";

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  appointments_count: number;
  last_visit: string | null;
}

export default function PatientsPage() {
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        "http://TechTalks-SmartCare.test/api/doctor/patients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const patientsData = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];

      setPatients(patientsData);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Unable to load patients. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredPatients = patients.filter((patient) => {
    const name = patient.name?.toLowerCase() || "";
    const email = patient.email?.toLowerCase() || "";
    const phone = patient.phone || "";

    return (
      name.includes(normalizedSearch) ||
      email.includes(normalizedSearch) ||
      phone.toLowerCase().includes(normalizedSearch)
    );
  });

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF7FB]">
            <Loader2 className="h-7 w-7 animate-spin text-[#0E7490]" />
          </div>
          <p className="text-sm font-medium text-slate-500">
            Loading your patients...
          </p>
        </div>
      </div>
    );
  }

  if (error && patients.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
            <AlertCircle className="h-7 w-7 text-rose-500" />
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            Unable to load patients
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => fetchPatients()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#075C70] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064B5B]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50/60 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#0E7490]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0E7490]" />
              Doctor dashboard
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Patients
            </h1>

            <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-500">
              View patient contact information and appointment history.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchPatients(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#B9DFE8] hover:bg-[#F5FAFC] hover:text-[#075C70] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Summary card */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#DCEEF3] bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#075C70] via-[#0E7490] to-cyan-300" />

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF7FB] text-[#0E7490]">
                <Users className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total patients
                </p>
                <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
                  {patients.length}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 sm:max-w-xs">
              <p className="text-xs leading-5 text-slate-500">
                {searchTerm.trim()
                  ? `${filteredPatients.length} matching ${
                      filteredPatients.length === 1
                        ? "patient"
                        : "patients"
                    }`
                  : "Patients who have booked appointments with you appear here."}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label
            htmlFor="patient-search"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Search patients
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

            <input
              id="patient-search"
              type="search"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#0E7490] focus:ring-4 focus:ring-cyan-50"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Refresh error */}
        {error && patients.length > 0 && (
          <div
            role="alert"
            className="mb-5 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="flex-1">{error}</p>
            <button
              type="button"
              onClick={() => fetchPatients(true)}
              className="shrink-0 font-semibold underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* Patient cards */}
        {filteredPatients.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10 sm:py-16">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF7FB]">
              {searchTerm ? (
                <Search className="h-8 w-8 text-[#0E7490]" />
              ) : (
                <Users className="h-8 w-8 text-[#0E7490]" />
              )}
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              {searchTerm ? "No matching patients" : "No patients yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {searchTerm
                ? "Try another name, email address, or phone number."
                : "Patients will appear here once they book appointments with you."}
            </p>

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">
                Patient directory
              </h2>

              <span className="rounded-lg bg-[#EAF7FB] px-2.5 py-1 text-xs font-semibold text-[#075C70]">
                {filteredPatients.length}{" "}
                {filteredPatients.length === 1 ? "result" : "results"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredPatients.map((patient) => {
                const name = patient.name || "Unnamed patient";

                const initials =
                  name
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase())
                    .join("") || "P";

                const visitCount = patient.appointments_count || 0;

                return (
                  <article
                    key={patient.id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#B9DFE8] hover:shadow-md"
                  >
                    {/* Card header */}
                    <div className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EAF7FB] to-[#D8F0F5] text-sm font-bold text-[#075C70]">
                          {initials}
                        </div>

                        <div className="min-w-0 flex-1 pt-0.5">
                          <h3 className="truncate text-base font-bold text-slate-900">
                            {name}
                          </h3>

                          <p className="mt-1 text-xs capitalize text-slate-500">
                            {patient.gender || "Gender not specified"}
                            {patient.age
                              ? ` · ${patient.age} years old`
                              : ""}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="mb-1.5 flex items-center gap-1.5 text-slate-400">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">
                              Appointments
                            </span>
                          </div>

                          <p className="text-lg font-bold text-slate-800">
                            {visitCount}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="mb-1.5 flex items-center gap-1.5 text-slate-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">
                              Last visit
                            </span>
                          </div>

                          <p className="truncate text-sm font-semibold text-slate-800">
                            {patient.last_visit
                              ? formatDate(patient.last_visit)
                              : "No visits"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact information */}
                    <div className="flex-1 border-t border-slate-100 px-5 py-4">
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Contact information
                      </p>

                      <div className="space-y-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <Mail className="h-4 w-4 shrink-0 text-[#0E7490]" />
                          {patient.email ? (
                            <a
                              href={`mailto:${patient.email}`}
                              title={patient.email}
                              className="truncate text-sm text-slate-600 transition hover:text-[#075C70]"
                            >
                              {patient.email}
                            </a>
                          ) : (
                            <span className="text-sm text-slate-400">
                              No email provided
                            </span>
                          )}
                        </div>

                        <div className="flex min-w-0 items-center gap-2.5">
                          <Phone className="h-4 w-4 shrink-0 text-[#0E7490]" />
                          {patient.phone ? (
                            <a
                              href={`tel:${patient.phone}`}
                              className="truncate text-sm text-slate-600 transition hover:text-[#075C70]"
                            >
                              {patient.phone}
                            </a>
                          ) : (
                            <span className="text-sm text-slate-400">
                              No phone provided
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Stethoscope className="h-3.5 w-3.5 text-[#0E7490]" />
                        Patient record
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#075C70]">
                        <UserRound className="h-3.5 w-3.5" />
                        Patient
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        <p className="mt-7 text-center text-xs text-slate-400">
          SmartCare · Patient directory
        </p>
      </div>
    </div>
  );
}