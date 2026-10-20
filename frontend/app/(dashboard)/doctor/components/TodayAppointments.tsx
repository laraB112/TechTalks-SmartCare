"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  CalendarCheck,
} from "lucide-react";
import AppointmentTable from "./AppointmentTable";

const API_URL = "http://TechTalks-SmartCare.test/api";

export interface Appointment {
  id: number;
  date: string;
  time: string;
  patientName: string;
  phone: string;
  age: number;
  gender: string;
  status: string;
}

interface TodayAppointmentsProps {
  onRefresh?: () => void;
  onAppointmentsChange?: (appointments: Appointment[]) => void;
}

function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatStatus(status?: string): string {
  const statusMap: Record<string, string> = {
    pending: "Pending",
    accepted: "Waiting",
    waiting: "Waiting",
    in_progress: "In Progress",
    "in progress": "In Progress",
    completed: "Completed",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };

  return statusMap[status?.toLowerCase() || ""] || status || "Pending";
}

export default function TodayAppointments({
  onRefresh,
  onAppointmentsChange,
}: TodayAppointmentsProps) {
  const [selectedDate, setSelectedDate] = useState(() =>
    getLocalDateString(new Date())
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDoctorAppointments = useCallback(
    async (date: string, isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setAppointments([]);
          onAppointmentsChange?.([]);
          setError("Please log in to view your appointments.");
          return;
        }

        const response = await fetch(
          `${API_URL}/doctor/appointments?date=${encodeURIComponent(date)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            setError("Your session has expired. Please log in again.");
            setAppointments([]);
            onAppointmentsChange?.([]);
            return;
          }

          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        const appointmentsData = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : null;

        if (!appointmentsData) {
          throw new Error("Unexpected appointments response format.");
        }

        const mappedAppointments: Appointment[] = appointmentsData.map(
          (item: any) => ({
            id: item.id,
            date: item.appointment_date || item.date || "",
            time: item.time_slot || item.time || "",
            patientName:
              item.patient?.name || item.patient_name || "Unknown Patient",
            phone: item.patient?.phone || item.phone || "N/A",
            age: item.patient?.age ?? item.age ?? 0,
            gender:
              item.patient?.gender || item.gender || "Not specified",
            status: formatStatus(item.status),
          })
        );

        setAppointments(mappedAppointments);
        onAppointmentsChange?.(mappedAppointments);
      } catch (error) {
        console.error("Error loading doctor appointments:", error);
        setError("Failed to load appointments. Please try again.");
        setAppointments([]);
        onAppointmentsChange?.([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [onAppointmentsChange]
  );

  const handleRefresh = useCallback(() => {
    void getDoctorAppointments(selectedDate, true);
    onRefresh?.();
  }, [getDoctorAppointments, selectedDate, onRefresh]);

  useEffect(() => {
    void getDoctorAppointments(selectedDate);
  }, [selectedDate, getDoctorAppointments]);

  const title = useMemo(() => {
    const today = getLocalDateString(new Date());

    if (selectedDate === today) {
      return "Today's Appointments";
    }

    const [year, month, day] = selectedDate.split("-").map(Number);
    const chosenDate = new Date(year, month - 1, day);

    return `Appointments · ${chosenDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
  }, [selectedDate]);

  const isToday = selectedDate === getLocalDateString(new Date());

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_-12px_rgba(15,76,92,0.14)] transition-shadow duration-300 hover:shadow-[0_12px_36px_-12px_rgba(15,76,92,0.19)]">
      {/* Subtle teal accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-800 via-teal-500 to-cyan-300" />

      {/* Main section header */}
      <div className="relative flex flex-col gap-5 border-b border-slate-100 px-5 pb-5 pt-7 sm:px-7 sm:pb-6 sm:pt-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-800 to-teal-600 text-white shadow-lg shadow-teal-800/20">
            <CalendarDays className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </div>

          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {title}
              </h2>
              {isToday && (
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-800 ring-1 ring-teal-100">
                  Today
                </span>
              )}
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-500">
              Your schedule at a glance. Keep track of patient visits and manage
              appointments throughout the day.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:justify-end">
          <label className="relative min-w-0 flex-1 sm:flex-none">
            <CalendarCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-700" />
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              aria-label="Select appointment date"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-9 pr-3 text-sm font-medium text-slate-700 outline-none transition-all duration-200 hover:border-teal-300 hover:bg-white focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-500/10 sm:w-auto"
            />
          </label>

          {!isToday && (
            <button
              type="button"
              onClick={() => setSelectedDate(getLocalDateString(new Date()))}
              className="rounded-xl border border-teal-100 bg-teal-50 px-3.5 py-2.5 text-sm font-semibold text-teal-800 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-100"
            >
              Today
            </button>
          )}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            aria-label="Refresh appointments"
            title="Refresh appointments"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="mx-4 mt-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 sm:mx-7"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-800">
              Unable to load appointments
            </p>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="text-sm font-semibold text-red-800 underline underline-offset-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table area */}
      <div className="p-3 sm:p-5 lg:p-6">
        <AppointmentTable
          appointments={appointments}
          loading={loading || refreshing}
          onStatusUpdate={handleRefresh}
        />
      </div>
    </section>
  );
}