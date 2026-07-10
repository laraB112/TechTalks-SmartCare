import { Phone, Ambulance, ShieldAlert, HeartPulse } from "lucide-react";

export default function EmergencyContactPage() {
  const emergencyContacts = [
    {
      title: "Emergency Ambulance",
      number: "140",
      icon: Ambulance,
      description: "Call ambulance service immediately",
    },
    {
      title: "Hospital Emergency",
      number: "+961 1 000 000",
      icon: HeartPulse,
      description: "24/7 hospital emergency department",
    },
    {
      title: "Police",
      number: "112",
      icon: ShieldAlert,
      description: "Contact police in urgent situations",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Emergency Contact
        </h1>
        <p className="mt-2 text-gray-500">
          Quickly reach emergency services when you need immediate help.
        </p>
      </div>

      {/* Emergency Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {emergencyContacts.map((contact) => {
          const Icon = contact.icon;

          return (
            <div
              key={contact.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex justify-center md:justify-start">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Icon size={25} />
                </div>

              </div>

              <h2 className="text-xl font-semibold text-gray-800 text-center md:text-start">
                {contact.title}
              </h2>

              <p className="mt-2 text-sm text-gray-500 text-center md:text-start">
                {contact.description}
              </p>

              <a
                href={`tel:${contact.number}`}
                className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700"
              >
                <Phone size={18} />
                {contact.number}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}