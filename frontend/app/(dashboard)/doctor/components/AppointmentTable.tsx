import AppointmentRow from "./AppointmentRow";
import type { Appointment } from "./TodayAppointments";

interface Props {
  appointments: Appointment[];
  loading: boolean;
}

export default function AppointmentTable({
  appointments,
  loading,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">

        <thead className="border-b bg-slate-50">
          <tr className="text-left text-gray-600">
            <th className="px-6 py-4">Time</th>
            <th className="px-6 py-4">Patient Name</th>
            <th className="px-6 py-4">Phone Number</th>
            <th className="px-6 py-4">Age / Gender</th>
            <th className="px-6 py-4">Issue / Reason</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>

        <tbody>

          {loading ? (
            <tr>
              <td
                colSpan={6}
                className="py-10 text-center"
              >
                Loading...
              </td>
            </tr>
          ) : appointments.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-10 text-center"
              >
                No appointments found.
              </td>
            </tr>
          ) : (
            appointments.map((appointment) => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
              />
            ))
          )}

        </tbody>

      </table>
    </div>
  );
}