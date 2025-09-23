import { useEffect, useRef } from "react";
import { Rocket, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const countersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (countersRef.current) {
      observer.observe(countersRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target')!;
      let count = 0;
      const increment = target / 100;
      
      const updateCount = () => {
        count += increment;
        if (count < target) {
          counter.textContent = Math.ceil(count).toString();
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target.toString();
        }
      };
      
      updateCount();
    });
  };

  return (
    <section id="about" className="min-h-screen bg-gradient-bg" data-testid="about-section">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Sticky Image */}
        <div className="lg:w-1/2 sticky top-0 h-screen flex items-center">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"
            alt="Creative workspace with team collaboration"
            className="w-full h-full object-cover"
            data-testid="about-image"
          />
        </div>
        
        {/* Right side - Scrolling Content */}
        <div className="lg:w-1/2 px-8 py-16 lg:py-32 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6 masked-text" data-testid="about-title">
              About Us
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8" data-testid="about-description">
              We are a team of passionate developers and designers dedicated to creating exceptional digital experiences. 
              With years of expertise in cutting-edge technologies, we transform your vision into reality.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-lg"
              data-testid="innovation-card"
            >
              <Rocket className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Innovation First</h3>
              <p className="text-muted-foreground">Always adopting the latest technologies and best practices.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-lg"
              data-testid="client-card"
            >
              <Users className="h-8 w-8 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">Client-Centric</h3>
              <p className="text-muted-foreground">Your success is our priority, every step of the way.</p>
            </motion.div>
          </div>

          {/* Rolling Counters */}
          <div ref={countersRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8" data-testid="counters-section">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary counter" data-target="150" data-testid="counter-projects">
                0
              </div>
              <div className="text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent counter" data-target="98" data-testid="counter-clients">
                0
              </div>
              <div className="text-muted-foreground">Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary counter" data-target="5" data-testid="counter-years">
                0
              </div>
              <div className="text-muted-foreground">Years</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent counter" data-target="24" data-testid="counter-support">
                0
              </div>
              <div className="text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
