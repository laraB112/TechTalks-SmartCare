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

  const fetchPatients = useCallback(
    async (isRefresh = false) => {
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
    },
    [router]
  );

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

          <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>

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
    <div className="min-h-full bg-slate-50/60 px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0E7490] sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0E7490]" />
              Doctor dashboard
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Patients
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              View and manage your patient directory.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchPatients(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-[#B9DFE8] hover:bg-[#F5FAFC] hover:text-[#075C70] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Compact summary */}
        <div className="mb-5 overflow-hidden rounded-xl border border-[#DCEEF3] bg-white shadow-sm sm:mb-6 sm:rounded-2xl">
          <div className="h-1 bg-gradient-to-r from-[#075C70] via-[#0E7490] to-cyan-300" />

          <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF7FB] text-[#0E7490] sm:h-11 sm:w-11">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 sm:text-sm">
                  Total patients
                </p>
                <p className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  {patients.length}
                </p>
              </div>
            </div>

            <div className="shrink-0 rounded-lg bg-[#F0F9FB] px-2.5 py-1.5 text-xs font-semibold text-[#075C70] sm:px-3 sm:py-2">
              {searchTerm.trim()
                ? `${filteredPatients.length} matching`
                : "Patient directory"}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5 sm:mb-6">
          <label
            htmlFor="patient-search"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Search patients
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 sm:left-4" />

            <input
              id="patient-search"
              type="search"
              placeholder="Name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full min-w-0 rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-[13px] text-slate-800 shadow-sm outline-none transition placeholder:text-ellipsis placeholder:text-slate-400 focus:border-[#0E7490] focus:ring-4 focus:ring-cyan-50 sm:pl-11 sm:pr-11 sm:text-sm"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 sm:right-3"
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
            <p className="min-w-0 flex-1">{error}</p>
            <button
              type="button"
              onClick={() => fetchPatients(true)}
              className="shrink-0 font-semibold underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* Patient directory */}
        {filteredPatients.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm sm:px-10 sm:py-14">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EAF7FB] to-[#D8F0F5]">
              {searchTerm ? (
                <Search className="h-7 w-7 text-[#0E7490]" />
              ) : (
                <Users className="h-7 w-7 text-[#0E7490]" />
              )}
            </div>

            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              {searchTerm ? "No matching patients" : "No patients yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {searchTerm
                ? "Try another name, email address, or phone number."
                : "Your patient directory will appear here when patients book appointments."}
            </p>

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
              <h2 className="text-sm font-bold text-slate-800">
                Patient directory
              </h2>

              <span className="rounded-lg bg-[#EAF7FB] px-2.5 py-1 text-xs font-semibold text-[#075C70]">
                {filteredPatients.length}{" "}
                {filteredPatients.length === 1 ? "result" : "results"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                    className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#B9DFE8] hover:shadow-md sm:rounded-2xl"
                  >
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#075C70] via-[#0E7490] to-cyan-300 opacity-70 transition-opacity group-hover:opacity-100" />

                    {/* Patient identity */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EAF7FB] to-[#D8F0F5] text-sm font-bold text-[#075C70] ring-1 ring-[#DCEEF3]">
                          {initials}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                            {name}
                          </h3>

                          <p className="mt-1 truncate text-xs capitalize text-slate-500">
                            {patient.gender || "Gender not specified"}
                            {patient.age != null
                              ? ` · ${patient.age} years old`
                              : ""}
                          </p>
                        </div>

                        <div className="shrink-0 rounded-lg bg-[#F0F9FB] p-2 text-[#0E7490] transition group-hover:bg-[#075C70] group-hover:text-white">
                          <UserRound className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Patient activity */}
                      <div className="mt-4 grid grid-cols-2 gap-2.5">
                        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-semibold sm:text-[11px]">
                              Appointments
                            </span>
                          </div>

                          <p className="mt-1.5 text-lg font-bold text-slate-800">
                            {visitCount}
                          </p>
                        </div>

                        <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            <span className="text-[10px] font-semibold sm:text-[11px]">
                              Last visit
                            </span>
                          </div>

                          <p className="mt-1.5 truncate text-sm font-bold text-slate-800">
                            {patient.last_visit
                              ? formatDate(patient.last_visit)
                              : "No visits"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact information */}
                    <div className="flex-1 border-t border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4">
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Contact details
                      </p>

                      <div className="space-y-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F0F9FB] text-[#0E7490]">
                            <Mail className="h-3.5 w-3.5" />
                          </div>

                          {patient.email ? (
                            <a
                              href={`mailto:${patient.email}`}
                              title={patient.email}
                              className="min-w-0 truncate text-xs text-slate-600 transition hover:text-[#075C70] sm:text-sm"
                            >
                              {patient.email}
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">
                              No email provided
                            </span>
                          )}
                        </div>

                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F0F9FB] text-[#0E7490]">
                            <Phone className="h-3.5 w-3.5" />
                          </div>

                          {patient.phone ? (
                            <a
                              href={`tel:${patient.phone}`}
                              className="min-w-0 truncate text-xs text-slate-600 transition hover:text-[#075C70] sm:text-sm"
                            >
                              {patient.phone}
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">
                              No phone provided
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 sm:px-5">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                        <Stethoscope className="h-3.5 w-3.5 text-[#0E7490]" />
                        Patient record
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Registered
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        <p className="mt-6 text-center text-[11px] text-slate-400 sm:mt-7 sm:text-xs">
          SmartCare · Patient directory
        </p>
      </div>
    </div>
  );
}
