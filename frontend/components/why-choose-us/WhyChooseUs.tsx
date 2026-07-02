import { CalendarCheck, Clock3, Headset, MapPin, ShieldCheck, Stethoscope } from "lucide-react";
import FeatureCard from "./FeatureCard";


const features = [
    {
        icon: <CalendarCheck size={34} />,
        title: "Easy Appointment Booking",
        description:
            "Book your appointment in just a few clicks anytime, anywhere.",
    },
    {
        icon: <Stethoscope size={34} />,
        title: "Experienced Doctors",
        description:
            "Connect with certified and highly qualified specialists.",
    },
    {
        icon: <Clock3 size={34} />,
        title: "Save Time",
        description:
            "Skip the waiting line by choosing your preferred schedule.",
    },
    {
        icon: <ShieldCheck size={34} />,
        title: "Secure & Private",
        description:
            "Your personal health information stays protected.",
    },
    {
        icon: <MapPin size={34} />,
        title: "Convenient Access",
        description:
            "Find trusted healthcare providers close to you.",
    },
    {
        icon: <Headset size={34} />,
        title: "24/7 Support",
        description:
            "Our support team is available whenever you need help.",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-5">
            <div className="mx-auto max-w-9xl px-6">
                {/* Heading */}
                <div className="mb-16 text-center">
                    <span className="font-semibold uppercase tracking-[5px] text-blue-600">
                        Why Choose Us
                    </span>

                    <h2 className="mt-5 text-5xl font-bold text-slate-900">
                        Your Health, Our Priority
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-500">
                        We make doctor appointments simple, fast and reliable so
                        you can focus on what matters most.
                    </p>
                </div>
                    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                        {features.map((feature) => (
                            <FeatureCard
                                key={feature.title}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </div>
            </div>
        </section>
    )
}