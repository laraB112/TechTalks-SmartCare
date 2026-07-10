"use client";

import { doctors } from "./doctor";
import DoctorCard from "./DoctorCard";

type DoctorListProps = {
  specialty: string;
};

export default function DoctorList({
  specialty,
}: DoctorListProps) {
  const filteredDoctors = doctors.filter(
    (doctor) => doctor.specialty === specialty
  );

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center md:text-start">
          Available Doctors
        </h2>

        <p className="text-gray-600 text-center md:text-start">
          Choose a doctor from the recommended specialty.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
          />
        ))}
      </div>
    </section>
  );
}