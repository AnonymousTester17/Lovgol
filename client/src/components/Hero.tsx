import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      data-testid="hero-section"
    >
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://pixabay.com/get/g6fe653a3f50d89d6b6d01ba22d868dca664379543f416234687d21ae225108b21471bbb3b3d8654816f462a27d0ed819657234187814d175872d0787fb24ae76_1280.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${offsetY * 0.5}px)`,
        }}
      />
      <div className="absolute inset-0 hero-gradient z-10" />
      
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>
          <h1 
            className="hero-text text-6xl md:text-8xl font-black mb-6 masked-text leading-tight"
            data-testid="hero-title"
          >
            LOVGOL
          </h1>
          <p 
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            data-testid="hero-subtitle"
          >
            Crafting Digital Experiences That Transform Ideas Into Reality
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={scrollToContact}
              className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              data-testid="button-start-project"
            >
              Start Your Project
            </Button>
            <Button
              onClick={scrollToServices}
              variant="outline"
              className="glass-card hover:bg-white/10 text-foreground px-8 py-4 rounded-lg font-semibold transition-all duration-300"
              data-testid="button-view-work"
            >
              View Our Work
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="h-8 w-8 text-muted-foreground" data-testid="scroll-indicator" />
      </div>
    </section>
  );
}
