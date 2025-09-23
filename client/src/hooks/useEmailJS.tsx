import { useState } from "react";
import emailjs from "@emailjs/browser";

interface EmailData {
  from_name: string;
  from_email: string;
  message: string;
  service?: string;
  budget?: string;
}

// EmailJS configuration - these would typically come from environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_demo";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_demo";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "demo_key";

export function useEmailJS() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (data: EmailData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Initialize EmailJS if not already done
      if (!emailjs.init) {
        emailjs.init(EMAILJS_PUBLIC_KEY);
      }

      const templateParams = {
        from_name: data.from_name,
        from_email: data.from_email,
        message: data.message,
        service: data.service || "Not specified",
        budget: data.budget || "Not specified",
        to_email: "hello@lovgol.com", // Company email
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log("Email sent successfully:", response);
      return { success: true, response };
    } catch (err) {
      console.error("EmailJS error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to send email";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendEmail,
    isLoading,
    error,
  };
}
