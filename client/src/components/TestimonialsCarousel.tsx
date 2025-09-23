import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  text: string;
  rating: number;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
}

export default function TestimonialsCarousel({ 
  testimonials, 
  autoPlay = true, 
  interval = 5000 
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      nextTestimonial();
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlaying, interval, currentIndex]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(autoPlay);

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid="testimonials-carousel"
    >
      <div className="relative h-96 overflow-hidden rounded-xl glass-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center p-8"
            data-testid={`testimonial-${currentIndex}`}
          >
            <div className="text-center">
              {/* Profile Image */}
              <motion.img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-20 h-20 rounded-full mx-auto mb-6 object-cover border-4 border-primary/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                data-testid={`testimonial-image-${currentIndex}`}
              />

              {/* Rating Stars */}
              <motion.div 
                className="flex justify-center mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                data-testid={`testimonial-rating-${currentIndex}`}
              >
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${
                      i < testimonials[currentIndex].rating
                        ? "text-yellow-400"
                        : "text-gray-600"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </motion.div>

              {/* Testimonial Text */}
              <motion.blockquote
                className="text-xl md:text-2xl font-light italic text-foreground mb-6 leading-relaxed max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                data-testid={`testimonial-text-${currentIndex}`}
              >
                "{testimonials[currentIndex].text}"
              </motion.blockquote>

              {/* Author Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                data-testid={`testimonial-author-${currentIndex}`}
              >
                <div className="font-semibold text-lg text-foreground">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-muted-foreground">
                  {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 glass-card hover:bg-primary/20 transition-colors"
          onClick={prevTestimonial}
          data-testid="testimonial-prev-button"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 glass-card hover:bg-primary/20 transition-colors"
          onClick={nextTestimonial}
          data-testid="testimonial-next-button"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center mt-6 space-x-2" data-testid="testimonial-indicators">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary scale-125"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            onClick={() => goToTestimonial(index)}
            data-testid={`testimonial-indicator-${index}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      {isAutoPlaying && (
        <div className="mt-4 w-full bg-muted-foreground/20 rounded-full h-1">
          <motion.div
            className="bg-primary h-1 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: interval / 1000, ease: "linear" }}
            key={`progress-${currentIndex}`}
            data-testid="testimonial-progress-bar"
          />
        </div>
      )}
    </div>
  );
}