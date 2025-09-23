import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ImageSequenceScrollProps {
  images: string[];
  className?: string;
  triggerHeight?: number;
}

export default function ImageSequenceScroll({ 
  images, 
  className = "", 
  triggerHeight = 400 
}: ImageSequenceScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // Preload all images
    const imagePromises = images.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    });

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch((err) => console.error("Failed to load sequence images:", err));
  }, [images]);

  useEffect(() => {
    if (!imagesLoaded || !containerRef.current) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerTop = rect.top;
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate scroll progress within the trigger area
      const scrollStart = containerTop - windowHeight;
      const scrollEnd = containerTop - windowHeight + triggerHeight;
      const scrollProgress = Math.min(Math.max((scrollStart * -1) / (scrollEnd - scrollStart), 0), 1);

      // Map scroll progress to frame index
      const frameIndex = Math.floor(scrollProgress * (images.length - 1));
      setCurrentFrame(Math.max(0, Math.min(frameIndex, images.length - 1)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Call once to set initial frame

    return () => window.removeEventListener("scroll", handleScroll);
  }, [imagesLoaded, images.length, triggerHeight]);

  if (!imagesLoaded) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height: triggerHeight }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`sticky top-1/2 transform -translate-y-1/2 ${className}`}
      style={{ height: triggerHeight }}
      data-testid="image-sequence-container"
    >
      <div className="relative w-full h-full">
        {images.map((src, index) => (
          <motion.img
            key={index}
            src={src}
            alt={`Sequence frame ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
            style={{ 
              opacity: index === currentFrame ? 1 : 0,
              zIndex: index === currentFrame ? 1 : 0
            }}
            animate={{ 
              opacity: index === currentFrame ? 1 : 0 
            }}
            transition={{ duration: 0.1 }}
            data-testid={`sequence-frame-${index}`}
          />
        ))}
      </div>
      
      {/* Progress indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full">
        <span className="text-white text-sm" data-testid="frame-counter">
          {currentFrame + 1} / {images.length}
        </span>
      </div>
    </div>
  );
}