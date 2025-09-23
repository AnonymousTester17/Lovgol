import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ServiceModal from "@/components/ServiceModal";
import InquiryModal from "@/components/InquiryModal";
import { useState } from "react";
import type { ServicePreview } from "@shared/schema";

export default function Home() {
  const [selectedService, setSelectedService] = useState<ServicePreview | null>(null);
  const [inquiryService, setInquiryService] = useState<string>("");
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  const handleServiceClick = (service: ServicePreview) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  const handleInquiryClick = (serviceName: string) => {
    setInquiryService(serviceName);
    setShowServiceModal(false);
    setShowInquiryModal(true);
  };

  return (
    <div className="smooth-scroll" data-testid="home-page">
      <Navigation />
      <Hero />
      <About />
      <Services onServiceClick={handleServiceClick} />
      <Clients />
      <Contact />
      <Footer />
      
      <ServiceModal
        service={selectedService}
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onInquiryClick={handleInquiryClick}
      />
      
      <InquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        initialService={inquiryService}
      />
    </div>
  );
}
