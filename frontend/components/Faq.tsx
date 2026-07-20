"use client";


import { ChevronDown } from "lucide-react";
import { useState } from "react";


const faqs = [
    {
        question: "How do I book an appointment?",
        answer:
            "Create an account, sign in, choose your preferred doctor, select an available date and time, then confirm your appointment.",
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
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Frequently Asked Questions
                    </h2>

                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        Find answers to the most common questions about booking
                        appointments, managing your account, and using our healthcare
                        services.
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
            </div>
        </section>

    );
}