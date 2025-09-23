import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, MessageCircle } from "lucide-react";
import type { ServicePreview } from "@shared/schema";
import { openWhatsApp } from "@/lib/whatsapp";

interface ServiceModalProps {
  service: ServicePreview | null;
  isOpen: boolean;
  onClose: () => void;
  onInquiryClick: (serviceName: string) => void;
}

export default function ServiceModal({ service, isOpen, onClose, onInquiryClick }: ServiceModalProps) {
  if (!service) return null;

  const handleWhatsAppClick = () => {
    const message = `Hi LOVGOL,\n\nI'm interested in your ${service.title} service. Can we discuss this further?`;
    openWhatsApp(message);
  };

  const handleInquiryClick = () => {
    onInquiryClick(service.title);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl glass-card border-border"
        data-testid="service-modal"
      >
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle 
              className="text-2xl font-bold"
              data-testid="modal-service-title"
            >
              {service.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="button-close-modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {service.imageUrl && (
            <img
              src={service.imageUrl}
              alt={service.title}
              className="w-full h-48 object-cover rounded-lg"
              data-testid="modal-service-image"
            />
          )}
          
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" data-testid="modal-service-category">
                {service.category}
              </Badge>
              <Badge variant="outline" data-testid="modal-service-technology">
                {service.technology}
              </Badge>
              {service.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-primary/20 text-primary"
                  data-testid={`modal-service-tag-${index}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            <p 
              className="text-muted-foreground mb-6"
              data-testid="modal-service-description"
            >
              {service.description}
            </p>
            
            <div className="space-y-4">
              <h4 className="font-semibold" data-testid="modal-features-title">
                Features Include:
              </h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground" data-testid="modal-features-list">
                <li>Responsive design across all devices</li>
                <li>Modern UI/UX best practices</li>
                <li>Performance optimization</li>
                <li>SEO-friendly implementation</li>
                <li>Ongoing support and maintenance</li>
              </ul>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleInquiryClick}
              className="flex-1 bg-primary hover:bg-primary/80"
              data-testid="button-start-inquiry"
            >
              Start Project Inquiry
            </Button>
            <Button
              onClick={handleWhatsAppClick}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              data-testid="button-whatsapp-service"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
