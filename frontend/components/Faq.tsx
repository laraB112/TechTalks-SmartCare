"use client";


import { ChevronDown,HelpCircle } from "lucide-react";
import { useState } from "react";


const faqs = [
    {
        question: "How do I book an appointment?",
        answer: "Log in to your account → Go to Dashboard → Click 'Book Appointment' → Browse doctors → Select a doctor and choose an available date/time → Confirm your booking.",
    },
    {
        question: "Can I cancel or reschedule my appointment?",
        answer:
            "Yes. You can manage your appointments from your dashboard and cancel or reschedule before the scheduled time.",
    },
    {
        question: "Do I need an account to book an appointment?",
        answer:
            "Yes. Creating an account allows you to securely manage your appointments, medical information, and booking history.",
    },
    {
        question: "How will I know if my appointment is confirmed?",
        answer:
            "Once your booking is completed, you'll receive an on-screen confirmation. You can also view all confirmed appointments in your account.",
    },
    {
        question: "Is my personal information secure?",
        answer:
            "Absolutely. We use modern security practices to protect your personal information and ensure your data remains confidential.",
    },
    {
        question: "Can I choose a specific doctor?",
        answer:
            "Yes. Browse our doctors, view their specialties and availability, and select the one that best suits your healthcare needs.",
    },
    {
        question: "How do I see my appointment history?",
        answer: "Go to 'My Appointments' page. You'll see all your past and upcoming appointments with their current status (Pending, Accepted, Completed, etc.).",
    },
    {

        question: "How do I know if a doctor is available?",
        answer: "When booking, you'll see available time slots for each doctor. Booked slots are shown as unavailable.",
    },
    {
        question: "What happens if I miss my appointment?",
        answer: "Please cancel at least 2 hours before your appointment. Missed appointments may incur a cancellation fee.",
    },
    {
        question: "How do I cancel my appointment?",
        answer: "Go to 'My Appointments' → Find the appointment → Click 'Cancel' → Provide a reason (optional) → Confirm cancellation.",
    }
];

export default function Faq() {

    const [openIndex, setOpenIndex] = useState<number | null>();

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };


    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
                {/* Heading */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <HelpCircle className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Frequently Asked Questions
                    </h2>

                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        You've got questions. We've got answers.
                    </p>
                </div>

                {/* FAQ */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-gray-200 bg-white shadow-sm"
                        >
                            <button
                                onClick={() => toggle(index)}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <span className="font-semibold text-gray-900">
                                    {faq.question}
                                </span>

                                <ChevronDown
                                    className={`w-5 h-5 text-blue-600 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index
                                    ? "max-h-40 opacity-100"
                                    : "max-h-0 opacity-0"
                                    }`}
                            >
                                <p className="px-5 pb-5 text-gray-600 leading-7">
                                    {faq.answer}
                                </p>
                            </div>

                        </div>
                    ))}
                </div>
                <div className="mt-10 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                    <p className="text-gray-700 text-sm sm:text-base">
                        Still have questions?{" "}
                        <a href="mailto:support@bookappointment.com" className="text-blue-600 font-medium hover:underline">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </section>

    );
}