import AppointmentCard from "./AppointmentCard";
import { appointments } from "./AppointmentData";
import Link from "next/link";

export default function UpcomingAppointments() {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Upcoming Appointments
          </h1>

          <p className="mt-2 text-gray-500">
            You have {appointments.length} upcoming appointment(s).
          </p>
        </div>

        <Link
         className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
         href="/patient/dashboard/bookappointment"
        >
          Book New Appointment
        </Link>
      </div>

      <div className="space-y-5">
        {appointments.map((appointment, index) => (
          <AppointmentCard
            key={index}
            doctor={appointment.doctor}
            specialty={appointment.specialty}
            hospital={appointment.hospital}
            date={appointment.date}
            time={appointment.time}
            status={appointment.status}
          />
        ))}
      </div>
    </section>
  );
}