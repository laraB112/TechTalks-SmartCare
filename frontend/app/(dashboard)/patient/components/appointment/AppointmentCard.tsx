import { CalendarDays, Clock, MapPin } from "lucide-react";

type AppointmentCardProps = {
  doctor: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "Cancelled";
};

export default function AppointmentCard({
  doctor,
  specialty,
  hospital,
  date,
  time,
  status,
}: AppointmentCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md lg:flex-row lg:items-center lg:justify-between">
      {/* Left Side */}
      <div className="space-y-2 lg:w-1/2 lg:min-w-0 ">
        <h3 className="truncate text-xl font-semibold text-gray-900">{doctor}</h3>

        <p className="text-gray-600">{specialty}</p>

        <div className="flex items-center gap-2 text-gray-500">
          <MapPin size={18} className="shrink-0"/>
          <span className="truncate">{hospital}</span>
        </div>
      </div>

      {/* Middle */}
      <div className="space-y-2 lg:w-1/4 lg:min-w-0">
        <div className="flex items-center gap-2 text-gray-700">
          <CalendarDays size={18} className="shrink-0"/>
          <span>{date}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Clock size={18} className="shrink-0"/>
          <span>{time}</span>
        </div>
      </div>

      {/* Right */}
      <div className="lg:w-1/6 lg:flex lg:justify-end">
        <span
          className={`rounded-full px-4 py-1 text-sm font-semibold
            ${
              status === "Confirmed"
                ? "bg-green-100 text-green-700"
                : status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}