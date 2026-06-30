import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ServiceCard from "@/components/ServiceCard";
import WhyChooseUs from "@/components/why-choose-us/WhyChooseUs";
import { Baby, HeartPulse, Stethoscope } from "lucide-react";
import { FaTooth } from "react-icons/fa";


export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        <ServiceCard
          title="General Medicine"
          description="Comprehensive healthcare for common illnesses, infections, and chronic conditions."
          icon={<Stethoscope className="h-11 w-11 text-blue-600" />}
          iconBg="bg-blue-100"
          href="/about"
        />

        <ServiceCard
          title="Cardiology"
          description="Expert care for your heart health, from prevention to advanced treatments."
          icon={<HeartPulse className="h-11 w-11 text-pink-500" />}
          iconBg="bg-pink-100"
          href="/about"
        />
        <ServiceCard
          title="Dentistry"
          description="Complete dental care for a healthy and confident smile."
          icon={<FaTooth className="h-11 w-11 text-violet-500" />}
          iconBg="bg-violet-100"
          href="/about"
        />
        <ServiceCard
          title="Pediatrics"
          description="Specialized care for infants, children, and adolescents."
          icon={<Baby className="h-11 w-11 text-yellow-500" />}
          iconBg="bg-yellow-100"
          href="/about"
        />

      </div>
      <WhyChooseUs/>
      <Footer />
    </>
  );
}