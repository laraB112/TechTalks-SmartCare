import AppointmentForm from "../components/appointment/AppointmentForm";

export default function BookAppointmentPage() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Book New Appointment
        </h1>

        <p className="mt-2 text-gray-500">
          Fill in the details below to schedule your appointment.
        </p>
      </div>

      <AppointmentForm />
    </section>
  );
}