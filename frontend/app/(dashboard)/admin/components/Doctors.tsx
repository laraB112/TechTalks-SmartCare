"use client";

import { Search, Plus, Users, UserCheck, UserX, Phone, Mail, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { type Doctor } from "./doctor";
import Link from "next/link";


type DoctorTableProps = {
    doctors: Doctor[];
};

export default function DoctorsPage({ doctors }: DoctorTableProps) {

    const [search, setSearch] = useState("");
    const totalDoctors = doctors.length;

    const filteredDoctors = doctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.email.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        <span className="text-blue-600">Doctors</span> Management
                    </h1>
                    <p className="mt-1 text-gray-500">
                        Manage all doctors
                    </p>
                </div>

                <Link
                    href="/admin/doctors/new"
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700">
                    <Plus size={18} />
                    Add Doctor
                </Link>
            </div>

            {/* Statistics */}
            <div className="mb-8 max-w-md">
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Doctors</p>
                            <h2 className="mt-2 text-3xl font-bold">{totalDoctors}</h2>
                        </div>

                        <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                            <Users size={28} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-md">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search doctor by name, email or specialty..."
                        className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto rounded-xl bg-white shadow md:block">
                <table className="min-w-full">
                    <thead className="border-b bg-gray-50">
                        <tr className="text-left text-sm font-semibold text-gray-600">
                            <th className="px-6 py-4">Doctor</th>
                            <th className="px-6 py-4">Specialty</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Experience</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredDoctors.map((doctor) => (
                            <tr
                                key={doctor.id}
                                className="border-b transition-colors hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 align-middle">
                                    <div className="flex items-center gap-3">

                                        <div>
                                            <p className="font-semibold">{doctor.name}</p>
                                            <p className="text-sm text-gray-500">{doctor.phone}</p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 align-middle">
                                    {doctor.specialty}
                                </td>

                                <td className="px-6 py-4 align-middle">
                                    {doctor.email}
                                </td>

                                <td className="px-6 py-4 align-middle">
                                    {doctor.experience} Years
                                </td>

                                <td className="px-6  py-4 align-middle">
                                    {doctor.isAvailable ? (
                                        <span className="text-green-600 font-semibold bg-green-100 rounded-full px-3 py-1">Available</span>
                                    ) : (
                                        <span className="text-red-600 font-medium bg-red-100 rounded-full px-3 py-1">Unavailable</span>
                                    )}
                                </td>

                                <td className="px-6 py-4 align-middle">
                                    <div className="flex justify-center gap-2">
                                        <Link
                                            href={`/admin/doctors/${doctor.id}`}
                                            className="cursor-pointer rounded bg-yellow-500 px-3 py-1 text-white hover:bg-blue-600 transition duration-300">
                                            Edit
                                        </Link>

                                        <button className="cursor-pointer rounded bg-red-500 px-3 py-1 text-white hover:bg-blue-600 transition duration-300">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 md:hidden">
                {doctors.map((doctor) => (
                    <div
                        key={doctor.id}
                        className="rounded-xl bg-white p-4 shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div>
                                <h3 className="font-semibold">{doctor.name}</h3>

                                <p className="text-sm text-gray-500">
                                    {doctor.specialty}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Mail size={16} />
                                    <p className="text-sm text-gray-500">
                                        {doctor.email}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Phone size={16} />
                                    <p className="text-sm text-gray-500">
                                        {doctor.phone}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <BadgeCheck size={16} className="text-blue-600"/>
                                    <p className="text-sm text-gray-500">
                                        {doctor.experience} Years Experience
                                    </p>
                                </div>

                            </div>
                        </div>

                        <div className="mt-4 flex justify-between">
                            <button className="rounded bg-yellow-500 px-3 py-2 text-white">
                                Edit
                            </button>

                            <button className="rounded bg-red-500 px-3 py-2 text-white">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}