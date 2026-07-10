"use client";

import Image from "next/image";
import { Star, Briefcase, CalendarPlus } from "lucide-react";
import { Doctor } from "./doctor";

type DoctorCardProps = {
  doctor: Doctor;
};

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* Doctor Information */}
      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-xl font-bold text-gray-900 text-center">
            {doctor.name}
          </h3>

          <p className="text-blue-600 font-medium text-center">
            {doctor.specialty}
          </p>
        </div>

        <div className="text-gray-600">
          <div className="flex items-center gap-2 justify-center">
            <Briefcase size={18} />
            <span>{doctor.experience} Years</span>
          </div>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700">
          <CalendarPlus size={20} />
          Book Appointment
        </button>
      </div>
    </div>
  );
}