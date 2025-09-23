import { useState } from "react";

interface EmailData {
  from_name: string;
  from_email: string;
  message: string;
  service?: string;
  budget?: string;
}

export function useEmailJS() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (data: EmailData) => {
    setIsLoading(true);
    setError(null);

    try {
      // EmailJS integration would go here
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Email would be sent:", data);
      
      // Simulate success
      return { success: true };
    } catch (err) {
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
