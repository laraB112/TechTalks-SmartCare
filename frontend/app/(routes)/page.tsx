import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Services from "@/components/services/Services";
import WhyChooseUs from "@/components/why-choose-us/WhyChooseUs";


export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <WhyChooseUs />
      <Footer />
    </>
  );
}