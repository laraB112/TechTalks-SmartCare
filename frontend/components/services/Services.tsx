import ServiceCard from "@/components/services/ServiceCard";
import { Baby, HeartPulse, Stethoscope } from "lucide-react";
import { FaTooth } from "react-icons/fa";

const services = [
    {
        title: "General Medicine",
        description: "Comprehensive healthcare for common illnesses, infections, and chronic conditions.",
        icon: <Stethoscope className="h-8 w-8 sm:h-11 sm:w-11 text-blue-600" />,
        iconBg: "bg-blue-100",
        href: "/about"
    },
    {
        title: "Cardiology",
        description: "Expert care for your heart health, from prevention to advanced treatments.",
        icon: <HeartPulse className="h-8 w-8 sm:h-11 sm:w-11 text-pink-500" />,
        iconBg: "bg-pink-100",
        href: "/about"
    },
    {
        title: "Dentistry",
        description: "Complete dental care for a healthy and confident smile.",
        icon: <FaTooth className="h-8 w-8 sm:h-11 sm:w-11 text-violet-500" />,
        iconBg: "bg-violet-100",
        href: "/about"
    },
    {
        title: "Pediatrics",
        description: "Specialized care for infants, children, and adolescents.",
        icon: <Baby className="h-8 w-8 sm:h-11 sm:w-11 text-yellow-500" />,
        iconBg: "bg-yellow-100",
        href: "/about"
    }
];

export default function Services() {
    return (
        <section className="py-20">
              <div className="mx-auto max-w-7xl px-4">
                     <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
                        {services.map((service) =>(
                            <ServiceCard key={service.title} {...service}/>
                        ))}
                     </div>
              </div>
            </section>
    );
}