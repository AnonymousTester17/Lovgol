import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { X, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { openWhatsApp } from "@/lib/whatsapp";
import { useEmailJS } from "@/hooks/useEmailJS";

const inquiryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  service: z.string().min(1, "Service is required"),
  details: z.string().min(1, "Project details are required"),
});

type InquiryFormData = z.infer<typeof inquiryFormSchema>;

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService: string;
}

export default function InquiryModal({ isOpen, onClose, initialService }: InquiryModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendEmail } = useEmailJS();

  const form = useForm<InquiryFormData>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: "",
      email: "",
      service: initialService,
      details: "",
    },
  });

  // Update service field when initialService changes
  useEffect(() => {
    if (initialService) {
      form.setValue("service", initialService);
    }
  }, [initialService, form]);

  const inquiryMutation = useMutation({
    mutationFn: async (data: InquiryFormData) => {
      // Save to database
      await apiRequest("POST", "/api/inquiry-submissions", data);
      
      // Send email via EmailJS
      await sendEmail({
        from_name: data.name,
        from_email: data.email,
        message: `Project Inquiry for ${data.service}\n\nDetails: ${data.details}`,
        service: data.service,
      });
    },
    onSuccess: () => {
      toast({
        title: "Inquiry sent!",
        description: "Thank you for your inquiry. We'll contact you shortly.",
      });
      form.reset();
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: InquiryFormData) => {
    setIsSubmitting(true);
    inquiryMutation.mutate(data);
  };

  const handleWhatsAppClick = () => {
    const formData = form.getValues();
    const message = `Hi LOVGOL,\n\nProject Inquiry:\nName: ${formData.name || 'Not specified'}\nEmail: ${formData.email || 'Not specified'}\nService: ${formData.service || 'Not specified'}\nDetails: ${formData.details || 'Not specified'}`;
    openWhatsApp(message);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-lg glass-card border-border"
        data-testid="inquiry-modal"
      >
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle 
              className="text-2xl font-bold"
              data-testid="inquiry-modal-title"
            >
              Project Inquiry
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="button-close-inquiry-modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="inquiry-form">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Name"
                      {...field}
                      className="bg-input border-border"
                      data-testid="input-inquiry-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      {...field}
                      className="bg-input border-border"
                      data-testid="input-inquiry-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly
                      className="bg-muted border-border"
                      data-testid="input-inquiry-service"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Project details..."
                      rows={4}
                      {...field}
                      className="bg-input border-border"
                      data-testid="textarea-inquiry-details"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/80"
                data-testid="button-send-inquiry"
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send Inquiry"}
              </Button>
              <Button
                type="button"
                onClick={handleWhatsAppClick}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                data-testid="button-whatsapp-inquiry"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
