import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import type { ServicePreview } from "@shared/schema";

const services: ServicePreview[] = [
  {
    name: "Web Development",
    description: "Crafting beautiful, high-performance websites tailored to your business needs.",
    technologies: ["React", "Node.js", "TypeScript", "TailwindCSS"],
  },
  {
    name: "Mobile App Development",
    description: "Building intuitive and engaging mobile applications for both iOS and Android platforms.",
    technologies: ["React Native", "Flutter", "Swift", "Kotlin"],
  },
  {
    name: "Automation & AI",
    description: "Streamlining your business processes with custom automation and AI-powered solutions.",
    technologies: ["Python", "LangChain", "OpenAI API", "Selenium"],
  },
];

interface ServicesProps {
  onServiceClick: (service: ServicePreview) => void;
}

export default function Services({ onServiceClick }: ServicesProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section 
      id="services" 
      className="py-20 px-4 sm:px-6 lg:px-8"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-extrabold text-center mb-4 text-white">
            Our <span className="text-primary">Services</span>
          </h2>
          <p className="text-lg text-gray-400 text-center max-w-3xl mx-auto mb-12">
            We offer a comprehensive suite of services to bring your digital ideas to life. From web and mobile development to cutting-edge AI solutions, we have you covered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              className="bg-gray-800 rounded-lg p-6 flex flex-col shadow-lg hover:shadow-primary/50 transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-3">{service.name}</h3>
              <p className="text-gray-400 mb-4 flex-grow">{service.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {service.technologies.map((tech) => (
                  <span key={tech} className="bg-primary/20 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
              <Button 
                onClick={() => onServiceClick(service)} 
                className="mt-auto w-full"
                variant="outline"
              >
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}