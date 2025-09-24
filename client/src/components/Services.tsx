import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ImageSequenceScroll from "./ImageSequenceScroll";
import type { ServicePreview } from "@shared/schema";

interface ServicesProps {
  onServiceClick: (service: ServicePreview) => void;
}

export default function Services({ onServiceClick }: ServicesProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeTechnology, setActiveTechnology] = useState<string>("");

  const { data: allServices = [], isLoading } = useQuery({
    queryKey: ["/api/service-previews"],
  });

  const getFilteredServices = () => {
    if (activeTechnology) {
      return allServices.filter((service: ServicePreview) => service.technology === activeTechnology);
    }
    if (activeCategory === "all") {
      return allServices;
    }
    return allServices.filter((service: ServicePreview) => service.category === activeCategory);
  };

  const filteredServices = getFilteredServices();

  const categories = [
    { id: "all", label: "All Services" },
    { id: "web", label: "Website Development" },
    { id: "app", label: "App Development" },
    { id: "automation", label: "Automations" },
  ];

  const technologies = {
    web: [
      { id: "mern", label: "MERN Stack" },
      { id: "php", label: "PHP" },
      { id: "wordpress", label: "WordPress" },
    ],
    app: [
      { id: "react-native", label: "React Native" },
      { id: "flutter", label: "Flutter" },
    ],
    automation: [
      { id: "python", label: "Python" },
      { id: "nodejs", label: "Node.js" },
    ],
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveTechnology("");
  };

  const handleTechnologyChange = (technologyId: string) => {
    setActiveTechnology(technologyId);
  };

  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-background" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-testid="loading-services">Loading services...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-background" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-6xl font-black mb-6 masked-text leading-tight" data-testid="services-title">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="services-description">
            From concept to deployment, we offer comprehensive digital solutions
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`px-6 py-3 rounded-full glass-card transition-all duration-300 ${
                  activeCategory === category.id ? "bg-primary text-primary-foreground" : ""
                }`}
                data-testid={`filter-${category.id}`}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Technology Sub-filters */}
          {activeCategory !== "all" && technologies[activeCategory as keyof typeof technologies] && (
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-2">
                {technologies[activeCategory as keyof typeof technologies].map((tech) => (
                  <Button
                    key={tech.id}
                    onClick={() => handleTechnologyChange(tech.id)}
                    variant={activeTechnology === tech.id ? "default" : "outline"}
                    size="sm"
                    className={`px-4 py-2 rounded-lg glass-card text-sm ${
                      activeTechnology === tech.id ? "bg-primary text-primary-foreground" : ""
                    }`}
                    data-testid={`sub-filter-${tech.id}`}
                  >
                    {tech.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Image Sequence Demo Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4 masked-text">See Our Work in Action</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Scroll down to see our development process unfold step by step
            </p>
          </div>

          <div style={{ height: "200vh" }} className="relative">
            <ImageSequenceScroll
              images={[
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop", 
                "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
              ]}
              className="w-full max-w-4xl mx-auto"
              triggerHeight={600}
            />
          </div>
        </div>

        {/* Service Cards */}
        {filteredServices.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8 text-muted-foreground" 
            data-testid="no-services"
          >
            No services found for the selected filters.
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            layout
            data-testid="services-grid"
          >
            {filteredServices.map((service: ServicePreview, index) => (
              <motion.div
                key={service.id}
                className="service-card glass-morphism rounded-xl overflow-hidden group cursor-pointer transform-gpu magnetic-hover hover-lift"
                data-testid={`service-card-${service.id}`}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -25, 
                  scale: 1.08,
                  rotateY: 8,
                  rotateX: 5,
                  boxShadow: "0 30px 60px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => onServiceClick(service)}
              >
                {service.imageUrl && (
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                      data-testid={`service-image-${service.id}`}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                >
                  <motion.div 
                    className="flex flex-wrap gap-2 mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                  >
                    {service.tags.slice(0, 2).map((tag, tagIndex) => (
                      <motion.div
                        key={tagIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.1 + 0.5 + tagIndex * 0.1,
                          ease: "backOut"
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Badge
                          variant="secondary"
                          className="bg-primary/20 text-primary text-xs px-2 py-1 rounded transition-all duration-200 hover:bg-primary/30"
                          data-testid={`service-tag-${service.id}-${tagIndex}`}
                        >
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                  <motion.h3 
                    className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300" 
                    data-testid={`service-title-${service.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                  >
                    {service.title}
                  </motion.h3>
                  <motion.p 
                    className="text-muted-foreground text-sm leading-relaxed" 
                    data-testid={`service-description-${service.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
                  >
                    {service.description}
                  </motion.p>

                  {/* Case Study Link Overlay */}
                  {(service.technology === "mern" || service.technology === "react-native" || service.technology === "python") && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          const caseStudySlug = service.technology === "mern" ? "ecommerce-platform" :
                                              service.technology === "react-native" ? "mobile-fitness-app" : 
                                              "automation-pipeline";
                          window.location.href = `/case-study/${caseStudySlug}`;
                        }}
                        className="bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                        data-testid={`case-study-link-${service.id}`}
                        initial={{ scale: 0.8, y: 20, opacity: 0 }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: 0, 
                          opacity: 1,
                          transition: { duration: 0.3, delay: 0.1 }
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Case Study
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}