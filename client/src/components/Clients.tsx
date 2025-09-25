import { motion } from "framer-motion";
import TestimonialsCarousel from "./TestimonialsCarousel";

export default function Clients() {
  const testimonials = [
    {
      id: 1,
      name: "Harsha Vardhan",
      role: "CEO",
      company: "TechCorp",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      text: "LOVGOL transformed our digital presence completely. The team's expertise in modern web technologies delivered beyond our expectations.",
      rating: 5
    },
    {
      id: 2,
      name: "Krishna Chaitanya",
      role: "Product Manager",
      company: "StartupX", 
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c8c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      text: "Outstanding mobile app development. Our users love the smooth performance and intuitive design they created for us.",
      rating: 5
    },
    {
      id: 3,
      name: "Jayakrishna",
      role: "CTO",
      company: "InnovateLab",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      text: "The automation solutions they built saved us countless hours. Professional, reliable, and innovative approach to problem-solving.",
      rating: 5
    },
    {
      id: 4,
      name: "Varshini",
      role: "Founder",
      company: "DigitalFlow",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      text: "From concept to launch, LOVGOL exceeded every expectation. Their attention to detail and user experience is unmatched.",
      rating: 5
    },
    {
      id: 5,
      name: "Hareesh",
      role: "VP Engineering",
      company: "CloudTech",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      text: "Working with LOVGOL was seamless. They delivered a robust, scalable solution that perfectly aligned with our technical requirements.",
      rating: 5
    }
  ];

  const companyLogos = ["TechCorp", "StartupX", "InnovateLab", "DigitalFlow", "CloudTech"];

  return (
    <section id="clients" className="py-20 bg-gradient-bg" data-testid="clients-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-black mb-6 masked-text" data-testid="clients-title">
            Our Clients
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="clients-description">
            Trusted by businesses worldwide to deliver exceptional results
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="mb-16">
          <TestimonialsCarousel 
            testimonials={testimonials}
            autoPlay={true}
            interval={6000}
          />
        </div>

        {/* Client Logos */}
        <div className="text-center" data-testid="client-logos-section">
          <h3 className="text-2xl font-semibold mb-8" data-testid="trusted-companies-title">
            Trusted by Leading Companies
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {companyLogos.map((logo, index) => (
              <div
                key={index}
                className="bg-white/10 px-6 py-4 rounded-lg"
                data-testid={`company-logo-${index}`}
              >
                <span className="text-xl font-bold">{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
