'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doctors } from "../../components/doctor";

export interface Doctor {
    id: number;
    name: string;
    email: string;
    specialty: string;
    experience: number;
    phone: string;
    isAvailable: boolean;
}

const emptyDoctor: Doctor = {
    id: 0,
    name: '',
    email: '',
    specialty: '',
    experience: 0,
    phone: '',
    isAvailable: true,
};

export default function DoctorFormPage() {
    const params = useParams();
    const router = useRouter();

    const isNew = params.id === 'new';

    const [doctor, setDoctor] = useState<Doctor>(emptyDoctor);
    const [loading, setLoading] = useState(!isNew);

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        specialty: "",
        experience: "",
        phone: "",
    });

    // Mock fetch for edit mode
    // useEffect(() => {
    //     if (!isNew) {
    //         const mockDoctor: Doctor = {
    //             id: Number(params.id),
    //             name: 'Dr. John Smith',
    //             email: 'john@example.com',
    //             specialty: 'Cardiology',
    //             experience: 10,
    //             phone: '+96170123456',
    //             isAvailable: true,
    //         };

    //         setDoctor(mockDoctor);
    //         setLoading(false);
    //     }
    // }, [isNew, params.id]);
    useEffect(() => {
        if (isNew) {
            setLoading(false);
            return;
        }

        const selectedDoctor = doctors.find(
            (d) => d.id === Number(params.id)
        );

        if (selectedDoctor) {
            setDoctor(selectedDoctor);
        }

        setLoading(false);
    }, [isNew, params.id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setDoctor((prev) => ({ ...prev, [name]: checked }));
        } else {
            setDoctor((prev) => ({
                ...prev,
                [name]: name === 'experience' ? Number(value) : value,
            }));
        }
    };
    const validate = () => {
        const newErrors = {
            name: "",
            email: "",
            specialty: "",
            experience: "",
            phone: "",
        };

        let valid = true;

        // Name
        if (!doctor.name.trim()) {
            newErrors.name = "Full name is required.";
            valid = false;
        } else if (doctor.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters.";
            valid = false;
        }

        // Email
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!doctor.email.trim()) {
            newErrors.email = "Email is required.";
            valid = false;
        } else if (!emailRegex.test(doctor.email.trim())) {
            newErrors.email = "Invalid email address.";
            valid = false;
        }

        // Specialty
        if (!doctor.specialty.trim()) {
            newErrors.specialty = "Specialty is required.";
            valid = false;
        }

        // Experience
        if (doctor.experience <= 0) {
            newErrors.experience =
                "Experience cannot be negative or zero";
            valid = false;
        }

        // Phone
        const phoneRegex =
            /^\+?[0-9]{8,15}$/;

        if (!doctor.phone.trim()) {
            newErrors.phone = "Phone number is required.";
            valid = false;
        } else if (!phoneRegex.test(doctor.phone.trim())) {
            newErrors.phone =
                "Enter a valid phone number.";
            valid = false;
        }

        setErrors(newErrors);

        return valid;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const doctorData = {
            ...doctor,
            name: doctor.name.trim(),
            email: doctor.email.trim().toLowerCase(),
            specialty: doctor.specialty.trim(),
            phone: doctor.phone.trim(),
        };

        console.log(doctorData);
        try {
            if (isNew) {
                // POST /api/doctors
                console.log('Creating doctor', doctor);
                doctors.push({
                    ...doctor,
                    id: doctors.length + 1,
                });
            } else {
                // PUT /api/doctors/:id
                console.log('Updating doctor', doctor);
                const index = doctors.findIndex(
                    (d) => d.id === Number(params.id)
                );

                if (index !== -1) {
                    doctors[index] = {
                        ...doctor,
                        id: Number(params.id),
                    };
                }
            }

            router.push('/admin/dashboard');
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <p className='p-6'>Loading...</p>;
    }

    return (
        <div className='p-4 md:p-6 max-w-4xl mx-auto'>
            <div className='bg-white rounded-2xl shadow p-6 md:p-8'>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-6'>
                    {isNew ? 'Add Doctor' : 'Edit Doctor'}
                </h1>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Full Name
                            </label>
                            <input
                                type='text'
                                name='name'
                                value={doctor.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your Full Name"
                                className='w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Email
                            </label>
                            <input
                                type='email'
                                name='email'
                                value={doctor.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                                className='w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Specialty
                            </label>
                            <input
                                type='text'
                                name='specialty'
                                value={doctor.specialty}
                                onChange={handleChange}
                                required
                                placeholder="Enter your specialty"
                                className='w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            {errors.specialty && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.specialty}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Experience (years)
                            </label>
                            <input
                                type='number'
                                name='experience'
                                min='0'
                                value={doctor.experience}
                                onChange={handleChange}
                                required
                                className='w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            {errors.experience && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.experience}
                                </p>
                            )}
                        </div>

                        <div className='md:col-span-2'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Phone Number
                            </label>
                            <input
                                type='tel'
                                name='phone'
                                value={doctor.phone}
                                onChange={handleChange}
                                required
                                placeholder="Enter your Number"
                                className='w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className='flex items-center gap-3'>
                        <input
                            type='checkbox'
                            id='isAvailable'
                            name='isAvailable'
                            checked={doctor.isAvailable}
                            onChange={handleChange}
                            className='h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                        />

                        <label
                            htmlFor='isAvailable'
                            className='text-sm font-medium text-gray-700'
                        >
                            Doctor is available
                        </label>
                    </div>

                    <div className='flex flex-col sm:flex-row gap-3 pt-4'>
                        <button
                            type='submit'
                            className='w-full sm:w-auto rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition'
                        >
                            {isNew ? 'Add Doctor' : 'Save Changes'}
                        </button>

                        <button
                            type='button'
                            onClick={() => router.back()}
                            className='w-full sm:w-auto rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100 transition'
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}