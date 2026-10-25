
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  CalendarClock,
  AlertTriangle,
} from "lucide-react";

interface Props {
  appointment: Appointment;
  onStatusUpdate?: () => void;
  variant?: "table" | "mobile";
}

type RejectionAction = "reject" | "reschedule/reject";

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

const API_URL = "http://TechTalks-SmartCare.test/api";

function formatRequestedDate(date?: string | null) {
  if (!date) return "—";

  const parts = date.slice(0, 10).split("-").map(Number);

  if (
    parts.length !== 3 ||
    parts.some((part) => !Number.isFinite(part)) ||
    parts[0] < 1 ||
    parts[1] < 1 ||
    parts[1] > 12 ||
    parts[2] < 1 ||
    parts[2] > 31
  ) {
    return date;
  }

  const parsed = new Date(parts[0], parts[1] - 1, parts[2]);

  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AppointmentRow({
  appointment,
  onStatusUpdate,
  variant = "table",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionAction, setRejectionAction] =
    useState<RejectionAction | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const status = appointment.status?.toLowerCase() || "";

  const requestedDate = appointment.requestedDate;
  const requestedTime = appointment.requestedTime;

  const hasRescheduleRequest = Boolean(requestedDate && requestedTime);

  const canAccept = status === "pending";
  const canReject = status === "pending" || status === "waiting";
  const canStart = status === "waiting" || status === "accepted";
  const canComplete =
    status === "in_progress" || status === "in progress";

  const isTerminal = ["completed", "rejected", "cancelled"].includes(status);
  const showActions = !isTerminal;

  const handleAction = async (action: string, reason?: string) => {
    if (loading) return;

    setLoading(true);
    setActionError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setActionError("Your session has expired. Please log in again.");
        return;
      }

      const isRescheduleAction =
        action === "reschedule/approve" ||
        action === "reschedule/reject";

      const response = await fetch(
        `${API_URL}/doctor/appointments/${appointment.id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          ...(reason !== undefined
            ? { body: JSON.stringify({ reason }) }
            : {}),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const validationErrors = data.errors
          ? Object.values(data.errors).flat().join(" ")
          : "";

        setActionError(
          validationErrors ||
          data.message ||
          (isRescheduleAction
            ? "Unable to process the reschedule request."
            : "Failed to update appointment.")
        );
        return;
      }

      setRejectionModalOpen(false);
      setRejectionReason("");
      setRejectionAction(null);

      onStatusUpdate?.();
    } catch (error) {
      console.error("Error updating appointment:", error);
      setActionError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openRejectionModal = (action: RejectionAction) => {
    setActionError("");
    setRejectionReason("");
    setRejectionAction(action);
    setRejectionModalOpen(true);
  };

  const closeRejectionModal = () => {
    if (loading) return;

    setRejectionModalOpen(false);
    setRejectionReason("");
    setRejectionAction(null);
  };

  const submitRejection = async () => {
    const reason = rejectionReason.trim();

    if (!reason) {
      setActionError("Please provide a rejection reason.");
      return;
    }

    if (!rejectionAction) return;

    await handleAction(rejectionAction, reason);
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

  const rescheduleActions = [
    {
      action: "reschedule/approve",
      label: "Approve reschedule request",
      text: "Approve change",
      icon: Check,
      style:
        "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    },
    {
      action: "reschedule/reject",
      label: "Reject reschedule request",
      text: "Decline change",
      icon: X,
      style: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
    },
  ];

  const statusBadge = (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusStyles[status] ||
        "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
        }`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {appointment.status || "Unknown"}
    </span>
  );

  const reschedulePanel = hasRescheduleRequest ? (
    <div className="mt-3 w-full min-w-0 rounded-xl border border-amber-200 bg-amber-50/70 p-3">
      <div className="flex items-start gap-2">
        <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-amber-900">
            Reschedule request
          </p>

          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Current:{" "}
            <span className="font-medium text-slate-800">
              {formatRequestedDate(appointment.date)} at{" "}
              {appointment.time || "—"}
            </span>
          </p>

          <p className="mt-1 break-words text-xs leading-relaxed text-slate-600">
            Requested:{" "}
            <span className="font-semibold text-amber-900">
              {formatRequestedDate(requestedDate)} at {requestedTime}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {rescheduleActions.map((button) => {
          const Icon = button.icon;

          return (
            <button
              key={button.action}
              type="button"
              onClick={() => {
                if (button.action === "reschedule/reject") {
                  openRejectionModal("reschedule/reject");
                } else {
                  void handleAction(button.action);
                }
              }}
              disabled={loading}
              title={button.label}
              className={`inline-flex min-h-8 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${button.style}`}
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Icon className="h-3.5 w-3.5 shrink-0" />
              )}
              {button.text}
            </button>
          );
        })}
      </div>
    </div>
  ) : null;

  const renderActionButtons = (compact = false) => (
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
                    onClick={() => {
                      if (button.action === "reject") {
                        openRejectionModal("reject");
                      } else {
                        void handleAction(button.action);
                      }
                    }}
                    disabled={loading}
                    title={button.label}
                    aria-label={button.label}
                    className={`inline-flex ${compact
                        ? "h-8 w-8 justify-center"
                        : "h-8 justify-center gap-1.5 px-2.5"
                      } items-center rounded-lg border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${button.style}`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {!compact && <span>{button.text}</span>}
                  </button>
                );
              })
          )}
        </div>
      )}
    </>
  );

  const rejectionModal =
    mounted && rejectionModalOpen
      ? createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeRejectionModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="rejection-modal-title"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  id="rejection-modal-title"
                  className="text-base font-bold text-slate-900"
                >
                  {rejectionAction === "reschedule/reject"
                    ? "Decline reschedule request"
                    : "Reject appointment"}
                </h2>

                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  Provide a reason so the patient can understand your
                  decision.
                </p>
              </div>

              <button
                type="button"
                onClick={closeRejectionModal}
                disabled={loading}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label
              htmlFor="rejection-reason"
              className="mt-5 block text-sm font-semibold text-slate-700"
            >
              Rejection reason <span className="text-red-600">*</span>
            </label>

            <textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(event) => {
                setRejectionReason(event.target.value);
                setActionError("");
              }}
              placeholder="Explain why this request is being rejected..."
              rows={4}
              maxLength={1000}
              required
              autoFocus
              className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />

            <div className="mt-1 text-right text-xs text-slate-400">
              {rejectionReason.length}/1000
            </div>

            {actionError && (
              <p
                role="alert"
                className="mt-2 text-sm leading-relaxed text-red-600"
              >
                {actionError}
              </p>
            )}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeRejectionModal}
                disabled={loading}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void submitRejection()}
                disabled={loading || !rejectionReason.trim()}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {loading ? "Submitting..." : "Confirm rejection"}
              </button>
            </div>
          </section>
        </div>,
        document.body
      )
      : null;

  if (variant === "mobile") {
    return (
      <>
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
                    <span className="capitalize">
                      {appointment.gender}
                    </span>
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
                <span className="text-xs text-slate-400">
                  No phone number
                </span>
              )}
            </div>

            {showActions && (
              <div className="flex shrink-0 flex-wrap items-center gap-1">
                {renderActionButtons(true)}
              </div>
            )}
          </div>

          {reschedulePanel}

          {actionError && !rejectionModalOpen && (
            <p role="alert" className="mt-2 text-xs text-red-600">
              {actionError}
            </p>
          )}
        </article>

        {rejectionModal}
      </>
    );
  }

  return (
    <>
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

              {appointment.phone && (
                <p className="mt-1 text-xs text-slate-500">
                  {appointment.phone}
                </p>
              )}
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
            {renderActionButtons(false)}
          </div>

          {reschedulePanel}

          {actionError && !rejectionModalOpen && (
            <p role="alert" className="mt-2 text-xs leading-relaxed text-red-600">
              {actionError}
            </p>
          )}
        </td>
      </tr>

      {rejectionModal}
    </>
  );
}
