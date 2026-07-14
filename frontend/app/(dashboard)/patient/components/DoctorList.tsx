"use client";

import { Doctor } from "./doctor";
import DoctorCard from "./DoctorCard";

type DoctorListProps = {
  doctors: Doctor[];
  loading?: boolean;
  error?: string;
};

export default function DoctorList({ doctors, loading, error }: DoctorListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Loading doctors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">No doctors available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}