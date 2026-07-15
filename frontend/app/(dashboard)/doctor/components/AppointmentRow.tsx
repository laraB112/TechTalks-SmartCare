import type { Appointment } from "./TodayAppointments";

interface Props {
  appointment: Appointment;
}

export default function AppointmentRow({
  appointment,
}: Props) {
  const statusStyle = {
    Waiting: "bg-yellow-100 text-yellow-700",
    Pending: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <tr className="border-b hover:bg-slate-50">

      <td className="px-6 py-5 font-semibold">
        {appointment.time}
      </td>

      <td className="px-6 py-5">
        {appointment.patientName}
      </td>

      <td className="px-6 py-5">
        {appointment.phone}
      </td>

      <td className="px-6 py-5">
        {appointment.age} / {appointment.gender}
      </td>

      <td className="px-6 py-5">
        {appointment.issue}
      </td>

      <td className="px-6 py-5">
        <span
          className={`rounded-full px-4 py-2 text-sm font-medium ${statusStyle[appointment.status]}`}
        >
          {appointment.status}
        </span>
      </td>

    </tr>
  );
}