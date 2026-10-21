"use client";

import AppointmentRow from "./AppointmentRow";
import { Appointment } from "./TodayAppointments";
import { Loader2, CalendarX } from "lucide-react";

interface Props {
  appointments: Appointment[];
  loading: boolean;
  onStatusUpdate?: () => void;
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center px-5 py-14 text-center">
      <Loader2 className="mb-3 h-7 w-7 animate-spin text-teal-700" />
      <p className="text-sm font-semibold text-slate-700">
        Loading appointments
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Getting your latest schedule
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center px-5 py-14 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-100">
        <CalendarX className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-slate-800">
        No appointments scheduled
      </p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        There are no appointments for this date. Try selecting another day.
      </p>
    </div>
  );
}

export default function AppointmentTable({
  appointments,
  loading,
  onStatusUpdate,
}: Props) {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      {loading ? (
        <LoadingState />
      ) : appointments.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Compact mobile schedule */}
          <div className="min-w-0 md:hidden">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50/80 px-3 py-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Patient / Time
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Status
              </span>
            </div>

            {appointments.map((appointment) => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
                onStatusUpdate={onStatusUpdate}
                variant="mobile"
              />
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden min-w-0 md:block">
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="whitespace-nowrap px-4 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 lg:px-6">
                      Time
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 lg:px-6">
                      Patient
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 lg:px-6">
                      Phone
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 lg:px-6">
                      Age / Gender
                    </th>
                    <th className="min-w-[180px] px-4 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 lg:px-6">
                      Status & Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {appointments.map((appointment) => (
                    <AppointmentRow
                      key={appointment.id}
                      appointment={appointment}
                      onStatusUpdate={onStatusUpdate}
                      variant="table"
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!loading && appointments.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:px-6">
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {appointments.length}
            </span>{" "}
            {appointments.length === 1 ? "appointment" : "appointments"}
          </p>
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
        </div>
      )}
    </div>
  );
}
