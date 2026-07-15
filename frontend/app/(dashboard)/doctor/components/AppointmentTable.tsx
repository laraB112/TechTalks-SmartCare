import AppointmentRow from "./AppointmentRow";
import { Appointment } from "./TodayAppointments";

interface Props {
  appointments: Appointment[];
  loading: boolean;
  onStatusUpdate?: () => void;
}

export default function AppointmentTable({ appointments, loading, onStatusUpdate }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr className="text-left">
            <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Time</th>
            <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Patient</th>
            <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Phone</th>
            <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">Age/Gender</th>
            <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="py-10 text-center text-gray-500">
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Loading...
                </span>
              </td>
            </tr>
          ) : appointments.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-10 text-center text-gray-500">
                No appointments found for this date.
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
  );
}