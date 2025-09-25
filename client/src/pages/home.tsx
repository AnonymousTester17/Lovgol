import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ServiceModal from "@/components/ServiceModal";
import InquiryModal from "@/components/InquiryModal";
import SEOHead from "@/components/SEOHead";
import { useState } from "react";
import type { ServicePreview } from "@shared/schema";
import VideoPlayer from "@/components/VideoPlayer";

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

  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "LOVGOL",
    "description": "Professional web development, mobile app development, and automation services",
    "url": "https://lovgol.com",
    "sameAs": [
      "https://twitter.com/lovgol",
      "https://linkedin.com/company/lovgol"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "foundingDate": "2023",
    "numberOfEmployees": "10-50",
    "knowsAbout": [
      "Web Development",
      "Mobile App Development",
      "Automation",
      "MERN Stack",
      "React Native",
      "Flutter",
      "Python",
      "Node.js"
    ]
  };

  return (
    <div className="smooth-scroll" data-testid="home-page">
      <SEOHead
        title="LOVGOL - Professional Web Development, Mobile Apps & Automation Services"
        description="Transform your digital presence with LOVGOL's expert web development, mobile app development, and automation services. Specializing in MERN stack, React Native, Flutter, and Python solutions."
        keywords="web development, mobile app development, automation, MERN stack, React Native, Flutter, Python, Node.js, custom software development"
        url="https://lovgol.com"
        type="website"
        structuredData={homeStructuredData}
      />
      <Navigation />
      <Hero />
      <About />
      <Services onServiceClick={handleServiceClick} />
      <Clients />
      <Contact />
      <Footer />
      
      <VideoPlayer />

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