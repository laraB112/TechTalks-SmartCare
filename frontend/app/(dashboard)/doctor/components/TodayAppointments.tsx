
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  RefreshCw,
  AlertCircle,
  CalendarCheck,
  BellRing,
} from "lucide-react";
import AppointmentTable from "./AppointmentTable";

const API_URL = "http://TechTalks-SmartCare.test/api";
const POLLING_INTERVAL = 30_000;

export interface Appointment {
  id: number;
  date: string;
  time: string;
  patientName: string;
  phone: string;
  age: number | null;
  gender: string;
  status: string;
  requestedDate: string | null;
  requestedTime: string | null;
  hasRescheduleRequest: boolean;
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
  const map: Record<string, string> = {
    pending: "Pending",
    accepted: "Waiting",
    waiting: "Waiting",
    in_progress: "In Progress",
    completed: "Completed",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };

  return map[status?.toLowerCase() || ""] || status || "Pending";
}

function formatDate(date?: string | null): string {
  if (!date) return "Unknown date";

  const parts = date.slice(0, 10).split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return date;

  const [year, month, day] = parts;
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError(null);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setAppointments([]);
          onAppointmentsChange?.([]);
          setError("Please log in to view your appointments.");
          return;
        }

        // Fetch all appointments so requests for other dates also appear.
        const response = await fetch(`${API_URL}/doctor/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            setAppointments([]);
            onAppointmentsChange?.([]);
            setError("Your session has expired. Please log in again.");
            return;
          }

          throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.json();
        const rows = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : null;

        if (!rows) throw new Error("Unexpected appointments response format.");

        const mapped: Appointment[] = rows.map((item: any) => ({
          id: item.id,
          date: item.appointment_date || item.date || "",
          time: item.time_slot || item.time || "",
          patientName: item.patient?.name || item.patient_name || "Unknown patient",
          phone: item.patient?.phone || item.phone || "",
          age: item.patient?.age ?? item.age ?? null,
          gender: item.patient?.gender || item.gender || "",
          status: formatStatus(item.status),
          requestedDate: item.requested_date || null,
          requestedTime: item.requested_time
            ? String(item.requested_time).slice(0, 5)
            : null,
          hasRescheduleRequest: Boolean(
            item.has_reschedule_request ||
            (item.requested_date && item.requested_time)
          ),
        }));

        setAppointments(mapped);
        onAppointmentsChange?.(mapped);
      } catch (err) {
        console.error("Error loading doctor appointments:", err);
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

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void getDoctorAppointments(selectedDate, true);
    }, POLLING_INTERVAL);

    return () => window.clearInterval(intervalId);
  }, [getDoctorAppointments, selectedDate]);

  const pendingReschedules = useMemo(
    () => appointments.filter((appointment) => appointment.hasRescheduleRequest),
    [appointments]
  );

  const visibleAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.date === selectedDate),
    [appointments, selectedDate]
  );

  const title = useMemo(() => {
    const today = getLocalDateString(new Date());
    if (selectedDate === today) return "Today's Appointments";

    const [year, month, day] = selectedDate.split("-").map(Number);
    return `Appointments · ${new Date(year, month - 1, day).toLocaleDateString(
      "en-GB",
      { day: "numeric", month: "long", year: "numeric" }
    )}`;
  }, [selectedDate]);

  const isToday = selectedDate === getLocalDateString(new Date());

  return (
    <section className="relative w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_-12px_rgba(15,76,92,0.14)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-800 via-teal-500 to-cyan-300" />

      <div className="flex min-w-0 flex-col gap-4 border-b border-slate-100 px-4 pb-5 pt-6 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-800 text-white sm:h-12 sm:w-12">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="break-words text-lg font-bold text-slate-900 sm:text-2xl">
                {title}
              </h2>
              {isToday && (
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase text-teal-800">
                  Today
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            aria-label="Select appointment date"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/10 sm:flex-none"
          />

          {!isToday && (
            <button
              type="button"
              onClick={() => setSelectedDate(getLocalDateString(new Date()))}
              className="rounded-xl border border-teal-100 bg-teal-50 px-3 py-2.5 text-sm font-semibold text-teal-800 hover:bg-teal-100"
            >
              Today
            </button>
          )}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            aria-label="Refresh appointments"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-teal-50 hover:text-teal-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Pending reschedule requests are shown regardless of selected date. */}
      <div className="border-b border-slate-100 px-3 py-4 sm:px-6 sm:py-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
            <BellRing className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Reschedule requests</h3>
            <p className="text-xs text-slate-500">
              Review a patient's requested date and time below.
            </p>
          </div>
          {pendingReschedules.length > 0 && (
            <span className="ml-auto rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
              {pendingReschedules.length}
            </span>
          )}
        </div>

        {pendingReschedules.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-4 text-center">
            <p className="text-sm font-medium text-slate-600">No pending reschedule requests</p>
            <p className="mt-1 text-xs text-slate-400">
              New requests will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingReschedules.map((appointment) => (
              <article
                key={appointment.id}
                className="flex min-w-0 flex-col gap-1 rounded-xl border border-amber-200 bg-amber-50/60 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-slate-900">
                    {appointment.patientName}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    Current: {formatDate(appointment.date)} at {appointment.time || "—"}
                  </p>
                  <p className="text-xs font-semibold leading-relaxed text-amber-900">
                    Requested: {formatDate(appointment.requestedDate)} at {appointment.requestedTime || "—"}
                  </p>
                </div>
                <p className="text-xs font-medium text-amber-800">
                  Awaiting your decision · #{appointment.id}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div role="alert" className="mx-3 mt-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-3 py-3 sm:mx-7 sm:px-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-800">Unable to load appointments</p>
            <p className="mt-1 break-words text-sm text-red-700">{error}</p>
          </div>
          <button type="button" onClick={handleRefresh} className="shrink-0 text-sm font-semibold text-red-800 underline">
            Retry
          </button>
        </div>
      )}

      <div className="min-w-0 p-2.5 sm:p-5 lg:p-6">
        <AppointmentTable
          appointments={visibleAppointments}
          loading={loading || refreshing}
          onStatusUpdate={handleRefresh}
        />
      </div>
    </section>
  );
}
