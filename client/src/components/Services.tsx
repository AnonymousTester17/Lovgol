import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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

        {/* Service Cards */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground" data-testid="no-services">
            No services found for the selected filters.
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            layout
            data-testid="services-grid"
          >
            {filteredServices.map((service: ServicePreview) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="service-card glass-card rounded-xl overflow-hidden cursor-pointer"
                onClick={() => onServiceClick(service)}
                data-testid={`service-card-${service.id}`}
              >
                {service.imageUrl && (
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                    data-testid={`service-image-${service.id}`}
                  />
                )}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {service.tags.slice(0, 2).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary/20 text-primary text-xs px-2 py-1 rounded"
                        data-testid={`service-tag-${service.id}-${index}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold mb-2" data-testid={`service-title-${service.id}`}>
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm" data-testid={`service-description-${service.id}`}>
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
