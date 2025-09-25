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

  const sendProjectUpdateEmail = async (emailData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      // Initialize EmailJS if not already done
      if (!emailjs.init) {
        emailjs.init(EMAILJS_PUBLIC_KEY);
      }

      const templateParams = {
        to_email: emailData.to_email,
        to_name: emailData.to_name,
        project_title: emailData.project_title,
        progress_percentage: emailData.progress_percentage,
        progress_description: emailData.progress_description,
        client_link: emailData.client_link,
        estimated_delivery: emailData.estimated_delivery,
        project_health: emailData.project_health.toUpperCase(),
        delivery_status: emailData.delivery_status,
        payment_status: emailData.payment_status,
        from_name: "LOVGOL Team",
        reply_to: "kolashankar113@gmail.com",
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        "template_project_update", // You'll need to create this template in EmailJS
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log("Project update email sent successfully:", response);
      return { success: true, response };
    } catch (err) {
      console.error("EmailJS error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to send project update email";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
        to_email: "kolashankar113@gmail.com", // Company email
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
    sendProjectUpdateEmail,
    isLoading,
    error,
  };
}
