export function openWhatsApp(message: string = "") {
  const phoneNumber = process.env.VITE_WHATSAPP_NUMBER || "+918688009537";
  const encodedMessage = encodeURIComponent(message || "Hi, I'm interested in your services!");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, "_blank");
}
