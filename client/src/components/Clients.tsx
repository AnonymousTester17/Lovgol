import { motion } from "framer-motion";

export default function Clients() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CEO, TechCorp",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      text: "LOVGOL transformed our digital presence completely. The team's expertise in modern web technologies delivered beyond our expectations."
    },
    {
      id: 2,
      name: "Emily Chen",
      role: "Product Manager, StartupX",
      image: "https://pixabay.com/get/gea03746256c13a6e01e091efc2bb4444832639429393ab5eab373b062b228bcf42386525dd8cb7e2019f30cab5a45bdfd50fc4372edf93ca0f975bfdf2847cd8_1280.jpg",
      text: "Outstanding mobile app development. Our users love the smooth performance and intuitive design they created for us."
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      role: "CTO, InnovateLab",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      text: "The automation solutions they built saved us countless hours. Professional, reliable, and innovative approach to problem-solving."
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

        {/* Testimonials */}
        <div className="stacked-cards relative max-w-4xl mx-auto mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-xl mb-8 transform transition-all duration-500"
              style={{
                transform: `translateY(${index * 10}px) scale(${1 - index * 0.02})`,
                zIndex: testimonials.length - index,
              }}
              data-testid={`testimonial-${testimonial.id}`}
            >
              <div className="flex items-start space-x-4">
                <img
                  src={testimonial.image}
                  alt={`${testimonial.name} testimonial`}
                  className="w-16 h-16 rounded-full object-cover"
                  data-testid={`testimonial-image-${testimonial.id}`}
                />
                <div>
                  <p className="text-lg mb-4 italic" data-testid={`testimonial-text-${testimonial.id}`}>
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-semibold" data-testid={`testimonial-name-${testimonial.id}`}>
                      {testimonial.name}
                    </div>
                    <div className="text-muted-foreground" data-testid={`testimonial-role-${testimonial.id}`}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
