"use client";

import { useEffect, useState } from "react";
//import { doctors } from "./doctor";
import DoctorCard from "./DoctorCard";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  experience: number;
};

type DoctorListProps = {
  specialty: string;
};
export default function DoctorList({ specialty }: DoctorListProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/doctors"
        );

        const data = await response.json();

        setDoctors(data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);
  const filteredDoctors = doctors.filter(
    (doctor) => doctor.specialty === specialty
  );

  if (loading) {
    return (
      <p className="text-center text-gray-500">
        Loading doctors...
      </p>
    );
  }

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