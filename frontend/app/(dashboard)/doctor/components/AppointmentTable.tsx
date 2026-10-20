import AppointmentRow from "./AppointmentRow";
import { Appointment } from "./TodayAppointments";
import { Loader2, CalendarX } from "lucide-react";

interface Props {
  appointments: Appointment[];
  loading: boolean;
  onStatusUpdate?: () => void;
}

export default function AppointmentTable({
  appointments,
  loading,
  onStatusUpdate,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="whitespace-nowrap px-4 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:px-6">
                Time
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:px-6">
                Patient
              </th>
              <th className="hidden whitespace-nowrap px-4 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:table-cell sm:px-6">
                Phone
              </th>
              <th className="hidden whitespace-nowrap px-4 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 md:table-cell md:px-6">
                Age / Gender
              </th>
              <th className="whitespace-nowrap px-4 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:px-6">
                Status & Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <Loader2 className="mb-3 h-7 w-7 animate-spin text-teal-700" />
                    <p className="text-sm font-semibold text-slate-700">
                      Loading appointments
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Getting your latest schedule
                    </p>
                  </div>
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-100">
                      <CalendarX className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      No appointments scheduled
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      There are no appointments for this date. Try selecting
                      another day.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  onStatusUpdate={onStatusUpdate}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

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