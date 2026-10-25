
"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
    ArrowRight,
    ChevronDown,
    HelpCircle,
    MessageCircle,
} from "lucide-react";

const faqs = [
    {
        question: "How do I book an appointment?",
        answer:
            "Log in to your account, open your dashboard, and select Book Appointment. Browse the available doctors, choose a suitable date and time, then confirm your booking.",
    },
    {
        question: "Can I cancel or reschedule my appointment?",
        answer:
            "Yes. You can manage your appointments from your dashboard and cancel or reschedule before the scheduled time.",
    },
    {
        question: "Do I need an account to book an appointment?",
        answer:
            "Yes. Creating an account allows you to manage your appointments, medical information, and booking history.",
    },
    {
        question: "How will I know if my appointment is confirmed?",
        answer:
            "Once your booking is completed, you'll receive an on-screen confirmation. You can also check the status of your appointments in your account.",
    },
    {
        question: "Is my personal information secure?",
        answer:
            "SmartCare is designed to handle personal information carefully. For details about the safeguards used by your platform, refer to your privacy policy.",
    },
    {
        question: "Can I choose a specific doctor?",
        answer:
            "Yes. Browse the available doctors, review their specialties and availability, and select the one that best suits your healthcare needs.",
    },
    {
        question: "How do I see my appointment history?",
        answer:
            "Open My Appointments in your account to view past and upcoming appointments along with their current status, such as Pending, Accepted, or Completed.",
    },
    {
        question: "How do I know if a doctor is available?",
        answer:
            "During booking, you'll see the available time slots for each doctor. Slots that are already booked should appear as unavailable.",
    },
    {
        question: "What happens if I miss my appointment?",
        answer:
            "If you can't attend, contact the clinic or manage your appointment through your account as soon as possible. Check the clinic's cancellation policy for any applicable fees.",
    },
    {
        question: "How do I cancel my appointment?",
        answer:
            "Open My Appointments, find the appointment, select Cancel, and follow the confirmation steps. You may be asked to provide a reason.",
    },
];

export default function FaqPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    function toggle(index: number) {
        setOpenIndex((current) => (current === index ? null : index));
    }

    return (
        <>
            <Navbar />

            <main className="relative isolate min-h-screen overflow-hidden bg-[#f7fbfc] pt-[68px] text-slate-800 sm:pt-[76px]">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_8%,rgba(186,230,245,0.42),transparent_38%),linear-gradient(180deg,#f7fbfc_0%,#ffffff_52%,#f2f9fb_100%)]"
                />

                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-20">
                    {/* Heading */}
                    <header className="faq-enter mx-auto mb-10 max-w-3xl text-center sm:mb-14 lg:mb-16">
                        <div className="mb-4 flex items-center justify-center gap-2 sm:mb-5">
                            <span className="h-px w-7 bg-[#0e7490] sm:w-9" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0e7490] sm:text-xs sm:tracking-[0.24em]">
                                We&apos;re here to help
                            </span>
                            <span className="h-px w-7 bg-[#0e7490] sm:w-9" />
                        </div>

                        <h1 className="text-3xl font-semibold leading-[1.12] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">
                            Questions?
                            <br className="sm:hidden" />{" "}
                            <span className="font-normal text-[#0e7490]">
                                We&apos;ve got answers.
                            </span>
                        </h1>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base">
                            Everything you need to know about booking appointments and using
                            SmartCare, all in one place.
                        </p>

                        <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-[#dce9ec] bg-white/70 px-4 py-2.5 shadow-sm backdrop-blur-sm sm:mt-7">
                            <HelpCircle className="h-4 w-4 text-[#0e7490]" />
                            <span className="text-xs font-medium text-slate-600 sm:text-sm">
                                {faqs.length} frequently asked questions
                            </span>
                        </div>
                    </header>

                    <div className="grid items-start gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
                        {/* Support panel */}
                        <aside className="faq-enter lg:sticky lg:top-28">
                            <div className="rounded-2xl border border-[#dce9ec] bg-white/80 p-5 shadow-[0_8px_30px_rgba(15,70,90,0.045)] backdrop-blur-sm sm:rounded-3xl sm:p-7">
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf6fa] text-[#075c70] sm:mb-5 sm:h-12 sm:w-12">
                                    <MessageCircle size={22} strokeWidth={1.7} />
                                </div>

                                <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                                    Need a little help?
                                </h2>

                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    Find quick answers here, or get in touch if you need more
                                    information about using SmartCare.
                                </p>

                                <a
                                    href="mailto:support@bookappointment.com"
                                    className="group mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#075c70] px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#064c5d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e9aa7] focus-visible:ring-offset-2"
                                >
                                    Contact Support
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </a>

                                <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
                                    We&apos;re happy to help with your questions.
                                </p>
                            </div>

                            <div className="mt-4 hidden rounded-2xl border border-[#dcebef] bg-[#eaf6fa]/70 p-5 lg:block">
                                <p className="text-sm font-semibold text-[#075c70]">
                                    A simpler way to get care.
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Explore SmartCare to discover a more convenient appointment
                                    experience.
                                </p>
                                <Link
                                    href="/about"
                                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0e7490] transition hover:text-[#075c70]"
                                >
                                    About SmartCare
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </aside>

                        {/* Questions */}
                        <div className="space-y-3 sm:space-y-4">
                            {faqs.map((faq, index) => {
                                const isOpen = openIndex === index;
                                const answerId = `faq-answer-${index}`;

                                return (
                                    <article
                                        key={faq.question}
                                        className={`faq-enter overflow-hidden rounded-xl border bg-white/85 transition-all duration-300 sm:rounded-2xl ${isOpen
                                                ? "border-[#b8dfe6] shadow-[0_10px_28px_rgba(7,92,112,0.075)]"
                                                : "border-[#e0eaed] hover:border-[#c4dfe5] hover:shadow-[0_6px_20px_rgba(15,70,90,0.04)]"
                                            }`}
                                        style={{
                                            animationDelay: `${Math.min(index * 55, 400)}ms`,
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggle(index)}
                                            aria-expanded={isOpen}
                                            aria-controls={answerId}
                                            className="flex w-full items-center gap-3 px-3.5 py-4 text-left sm:gap-4 sm:px-5 sm:py-5"
                                        >
                                            <span
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[10px] font-semibold transition-colors sm:text-xs ${isOpen
                                                        ? "bg-[#075c70] text-white"
                                                        : "bg-[#eaf6fa] text-[#0e7490]"
                                                    }`}
                                            >
                                                {String(index + 1).padStart(2, "0")}
                                            </span>

                                            <span
                                                className={`min-w-0 flex-1 text-[13px] font-semibold leading-5 transition-colors sm:text-[15px] sm:leading-6 ${isOpen ? "text-[#075c70]" : "text-slate-800"
                                                    }`}
                                            >
                                                {faq.question}
                                            </span>

                                            <span
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isOpen
                                                        ? "rotate-180 bg-[#eaf6fa] text-[#075c70]"
                                                        : "bg-slate-100/80 text-slate-500"
                                                    }`}
                                            >
                                                <ChevronDown size={17} />
                                            </span>
                                        </button>

                                        <div
                                            id={answerId}
                                            aria-hidden={!isOpen}
                                            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen
                                                    ? "grid-rows-[1fr] opacity-100"
                                                    : "grid-rows-[0fr] opacity-0"
                                                }`}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="ml-[3.1rem] border-t border-slate-100 pb-4 pr-4 pt-3 sm:ml-[4.25rem] sm:pb-5 sm:pr-6 sm:pt-4">
                                                    <p className="text-xs leading-[1.8] text-slate-600 sm:text-sm sm:leading-7">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`
        .faq-enter {
          animation: fadeUp 650ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .faq-enter {
            animation: none !important;
          }
        }
      `}</style>
        </>
    );
}
