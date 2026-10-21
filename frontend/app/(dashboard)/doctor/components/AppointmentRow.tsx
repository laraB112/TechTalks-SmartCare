"use client";

import { useState } from "react";
import { Appointment } from "./TodayAppointments";
import {
  Check,
  X,
  Play,
  CheckCircle,
  Loader2,
  Clock,
  Phone,
  UserRound,
} from "lucide-react";

interface Props {
  appointment: Appointment;
  onStatusUpdate?: () => void;
  variant?: "table" | "mobile";
}

const statusStyles: Record<string, string> = {
  waiting: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  pending: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  accepted: "bg-cyan-50 text-cyan-800 ring-1 ring-cyan-200",
  "in progress": "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  in_progress: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-1 ring-red-200",
  cancelled: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

export default function AppointmentRow({
  appointment,
  onStatusUpdate,
  variant = "table",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const status = appointment.status?.toLowerCase() || "";

  const canAccept = status === "pending";
  const canReject = status === "pending" || status === "waiting";
  const canStart = status === "waiting" || status === "accepted";
  const canComplete =
    status === "in_progress" || status === "in progress";

  const isTerminal = [
    "completed",
    "rejected",
    "cancelled",
  ].includes(status);

  const showActions = !isTerminal;

  const handleAction = async (action: string) => {
    if (loading) return;

    setLoading(true);
    setActionError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setActionError("Your session has expired. Please log in again.");
        return;
      }

      const response = await fetch(
        `http://TechTalks-SmartCare.test/api/doctor/appointments/${appointment.id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setActionError(data.message || "Failed to update appointment.");
        return;
      }

      onStatusUpdate?.();
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setActionError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const actionButtons = [
    {
      visible: canAccept,
      action: "accept",
      label: "Accept appointment",
      text: "Accept",
      icon: Check,
      style:
        "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    },
    {
      visible: canReject,
      action: "reject",
      label: "Reject appointment",
      text: "Reject",
      icon: X,
      style: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
    },
    {
      visible: canStart,
      action: "start",
      label: "Start appointment",
      text: "Start",
      icon: Play,
      style: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
    },
    {
      visible: canComplete,
      action: "complete",
      label: "Complete appointment",
      text: "Complete",
      icon: CheckCircle,
      style:
        "border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100",
    },
  ];

  const statusBadge = (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
        statusStyles[status] ||
        "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
      }`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {appointment.status || "Unknown"}
    </span>
  );

  const actions = (
    <>
      {showActions && (
        <div className="flex flex-wrap items-center gap-1.5">
          {loading ? (
            <Loader2
              className="h-4 w-4 animate-spin text-teal-700"
              aria-label="Updating appointment"
            />
          ) : (
            actionButtons
              .filter((button) => button.visible)
              .map((button) => {
                const Icon = button.icon;

                return (
                  <button
                    key={button.action}
                    type="button"
                    onClick={() => handleAction(button.action)}
                    disabled={loading}
                    title={button.label}
                    aria-label={button.label}
                    className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${button.style}`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{button.text}</span>
                  </button>
                );
              })
          )}
        </div>
      )}

      {actionError && (
        <p
          role="alert"
          className="mt-2 text-xs leading-relaxed text-red-600"
        >
          {actionError}
        </p>
      )}
    </>
  );

  if (variant === "mobile") {
    return (
      <article className="min-w-0 border-b border-slate-100 px-3 py-3 last:border-b-0 transition-colors hover:bg-teal-50/30">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-sm font-semibold text-teal-800 ring-1 ring-teal-100">
              {appointment.patientName?.trim()?.charAt(0)?.toUpperCase() || (
                <UserRound className="h-4 w-4" />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {appointment.patientName || "Unknown patient"}
              </p>

              <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                  <Clock className="h-3 w-3 text-teal-700" />
                  {appointment.time || "—"}
                </span>

                {appointment.age != null && (
                  <span>{appointment.age} yrs</span>
                )}

                {appointment.gender && (
                  <span className="capitalize">{appointment.gender}</span>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0">{statusBadge}</div>
        </div>

        <div className="mt-2 flex min-w-0 items-center justify-between gap-2">
          <div className="min-w-0">
            {appointment.phone ? (
              <a
                href={`tel:${appointment.phone}`}
                className="inline-flex max-w-full items-center gap-1.5 text-xs text-slate-500 hover:text-teal-800"
              >
                <Phone className="h-3 w-3 shrink-0" />
                <span className="truncate">{appointment.phone}</span>
              </a>
            ) : (
              <span className="text-xs text-slate-400">No phone number</span>
            )}
          </div>

          {showActions && (
            <div className="flex shrink-0 items-center gap-1">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-teal-700" />
              ) : (
                actionButtons
                  .filter((button) => button.visible)
                  .map((button) => {
                    const Icon = button.icon;

                    return (
                      <button
                        key={button.action}
                        type="button"
                        onClick={() => handleAction(button.action)}
                        disabled={loading}
                        title={button.label}
                        aria-label={button.label}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 disabled:opacity-50 ${button.style}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </button>
                    );
                  })
              )}
            </div>
          )}
        </div>

        {actionError && (
          <p role="alert" className="mt-2 text-xs text-red-600">
            {actionError}
          </p>
        )}
      </article>
    );
  }

  return (
    <tr className="border-b border-slate-100 transition-colors hover:bg-teal-50/40">
      <td className="whitespace-nowrap px-4 py-4 sm:px-6">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Clock className="h-4 w-4 shrink-0 text-teal-700" />
          {appointment.time || "—"}
        </div>
      </td>

      <td className="px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-sm font-semibold text-teal-800 ring-1 ring-teal-100">
            {appointment.patientName?.trim()?.charAt(0)?.toUpperCase() || (
              <UserRound className="h-4 w-4" />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {appointment.patientName || "Unknown patient"}
            </p>
          </div>
        </div>
      </td>

      <td className="hidden px-4 py-4 sm:table-cell sm:px-6">
        {appointment.phone ? (
          <a
            href={`tel:${appointment.phone}`}
            className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-teal-800"
          >
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            {appointment.phone}
          </a>
        ) : (
          <span className="text-sm text-slate-400">—</span>
        )}
      </td>

      <td className="hidden px-4 py-4 text-sm text-slate-600 md:table-cell md:px-6">
        {appointment.age != null || appointment.gender ? (
          <span>
            {appointment.age ?? "—"} / {appointment.gender || "—"}
          </span>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </td>

      <td className="min-w-[180px] px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {statusBadge}
          {actions}
        </div>
      </td>
    </tr>
  );
}
