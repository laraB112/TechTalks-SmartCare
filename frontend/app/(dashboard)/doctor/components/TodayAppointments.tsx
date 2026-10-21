"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  RefreshCw,
  AlertCircle,
  CalendarCheck,
  BellRing,
  Clock3,
  ArrowRight,
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
  age: number;
  gender: string;
  status: string;
}

interface AppointmentChange {
  id: number;
  appointment_id: number;
  change_type: string;
  old_date: string | null;
  old_time: string | null;
  new_date: string | null;
  new_time: string | null;
  changed_at: string | null;
  patient: {
    id: number | null;
    name: string | null;
  };
}

interface AppointmentChangesResponse {
  data: AppointmentChange[];
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

function formatDate(date?: string | null): string {
  if (!date) return "Unknown date";

  const parts = date.split("-").map(Number);

  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return date;
  }

  const [year, month, day] = parts;
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time?: string | null): string {
  if (!time) return "Unknown time";

  const [hours, minutes] = time.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return time;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
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
  const [appointmentChanges, setAppointmentChanges] = useState<
    AppointmentChange[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notificationError, setNotificationError] = useState<string | null>(
    null
  );

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
            gender: item.patient?.gender || item.gender || "Not specified",
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

  const getDoctorAppointmentChanges = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setAppointmentChanges([]);
        return;
      }

      const response = await fetch(
        `${API_URL}/doctor/appointment-changes?limit=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Notification request failed with status ${response.status}`
        );
      }

      const result: AppointmentChangesResponse = await response.json();

      if (!Array.isArray(result.data)) {
        throw new Error("Unexpected notification response format.");
      }

      setAppointmentChanges(result.data);
      setNotificationError(null);
    } catch (error) {
      console.error("Error loading appointment notifications:", error);
      setNotificationError(
        "Appointment updates could not be refreshed. Please try again."
      );
    }
  }, []);

  const handleRefresh = useCallback(() => {
    void getDoctorAppointments(selectedDate, true);
    void getDoctorAppointmentChanges();
    onRefresh?.();
  }, [
    getDoctorAppointments,
    getDoctorAppointmentChanges,
    selectedDate,
    onRefresh,
  ]);

  useEffect(() => {
    void getDoctorAppointments(selectedDate);
  }, [selectedDate, getDoctorAppointments]);

  useEffect(() => {
    void getDoctorAppointmentChanges();

    const intervalId = window.setInterval(() => {
      void getDoctorAppointmentChanges();
    }, POLLING_INTERVAL);

    return () => window.clearInterval(intervalId);
  }, [getDoctorAppointmentChanges]);

  const rescheduledAppointments = useMemo(
    () =>
      appointmentChanges.filter(
        (change) => change.change_type === "rescheduled"
      ),
    [appointmentChanges]
  );

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
    <section className="relative w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_-12px_rgba(15,76,92,0.14)] transition-shadow duration-300 hover:shadow-[0_12px_36px_-12px_rgba(15,76,92,0.19)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-800 via-teal-500 to-cyan-300" />

      <div className="relative flex min-w-0 flex-col gap-4 border-b border-slate-100 px-4 pb-5 pt-6 sm:gap-5 sm:px-7 sm:pb-6 sm:pt-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-800 to-teal-600 text-white shadow-lg shadow-teal-800/20 sm:h-12 sm:w-12 sm:rounded-2xl">
            <CalendarDays className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h2 className="break-words text-lg font-bold tracking-tight text-slate-900 sm:text-2xl">
                {title}
              </h2>

              {isToday && (
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-800 ring-1 ring-teal-100">
                  Today
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:gap-3 lg:w-auto lg:justify-end">
          <label className="relative min-w-0 flex-1 sm:flex-none">
            <CalendarCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-700" />

            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              aria-label="Select appointment date"
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-9 pr-2 text-xs font-medium text-slate-700 outline-none transition-all duration-200 hover:border-teal-300 hover:bg-white focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-500/10 sm:w-auto sm:pr-3 sm:text-sm"
            />
          </label>

          {!isToday && (
            <button
              type="button"
              onClick={() => setSelectedDate(getLocalDateString(new Date()))}
              className="shrink-0 rounded-xl border border-teal-100 bg-teal-50 px-3 py-2.5 text-xs font-semibold text-teal-800 transition-all duration-200 hover:bg-teal-100 sm:px-3.5 sm:text-sm"
            >
              Today
            </button>
          )}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            aria-label="Refresh appointments and notifications"
            title="Refresh appointments and notifications"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Reschedule notifications */}
      <div className="border-b border-slate-100 px-3 py-4 sm:px-6 sm:py-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
              <BellRing className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900">
                Appointment updates
              </h3>
              <p className="text-xs text-slate-500">
                Patient rescheduling notifications
              </p>
            </div>
          </div>

          {rescheduledAppointments.length > 0 && (
            <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800 ring-1 ring-teal-100">
              {rescheduledAppointments.length}
            </span>
          )}
        </div>

        {notificationError && (
          <div
            role="alert"
            className="mb-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{notificationError}</span>
            <button
              type="button"
              onClick={() => void getDoctorAppointmentChanges()}
              className="ml-auto shrink-0 font-semibold underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}

        {rescheduledAppointments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-5 text-center">
            <p className="text-sm font-medium text-slate-600">
              No reschedule updates yet
            </p>
            <p className="mt-1 text-xs text-slate-400">
              New updates will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {rescheduledAppointments.map((change) => (
              <article
                key={change.id}
                className="min-w-0 rounded-xl border border-teal-100 bg-gradient-to-r from-teal-50/80 to-white p-3 sm:p-4"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-teal-800 ring-1 ring-teal-100">
                    <CalendarCheck className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-bold text-slate-900">
                      {change.patient?.name || "A patient"} rescheduled an appointment
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Appointment #{change.appointment_id}
                      {change.changed_at
                        ? ` · ${new Date(
                          change.changed_at.replace(" ", "T")
                        ).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                        : ""}
                    </p>

                    <div className="mt-3 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                      <div className="min-w-0 rounded-lg border border-slate-200 bg-white/80 p-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Previous time
                        </p>
                        <p className="mt-1 break-words text-xs font-semibold text-slate-700">
                          {formatDate(change.old_date)}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock3 className="h-3 w-3 shrink-0" />
                          {formatTime(change.old_time)}
                        </p>
                      </div>

                      <div className="hidden justify-center text-teal-600 sm:flex">
                        <ArrowRight className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 rounded-lg border border-teal-100 bg-white p-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                          New time
                        </p>
                        <p className="mt-1 break-words text-xs font-semibold text-slate-900">
                          {formatDate(change.new_date)}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-teal-800">
                          <Clock3 className="h-3 w-3 shrink-0" />
                          {formatTime(change.new_time)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-2 text-xs font-medium text-amber-700">
                      The appointment is awaiting your approval again.
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Appointment loading error */}
      {error && (
        <div
          role="alert"
          className="mx-3 mt-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-3 py-3 sm:mx-7 sm:px-4"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-800">
              Unable to load appointments
            </p>
            <p className="mt-1 break-words text-sm text-red-700">{error}</p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="shrink-0 text-sm font-semibold text-red-800 underline underline-offset-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Existing appointment list/table */}
      <div className="min-w-0 p-2.5 sm:p-5 lg:p-6">
        <AppointmentTable
          appointments={appointments}
          loading={loading || refreshing}
          onStatusUpdate={handleRefresh}
        />
      </div>
    </section>
  );
}
