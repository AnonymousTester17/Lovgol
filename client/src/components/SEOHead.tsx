import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
  siteName?: string;
  structuredData?: object;
}

export default function SEOHead({
  title,
  description,
  keywords = "",
  image = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop",
  url = "",
  type = "website",
  publishedTime,
  author = "LOVGOL",
  siteName = "LOVGOL",
  structuredData,
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Create or update meta tags
    const updateOrCreateMeta = (name: string, content: string, property = false) => {
      const attribute = property ? "property" : "name";
      const existingMeta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (existingMeta) {
        existingMeta.setAttribute("content", content);
      } else {
        const meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };

    // Basic meta tags
    updateOrCreateMeta("description", description);
    if (keywords) updateOrCreateMeta("keywords", keywords);
    updateOrCreateMeta("author", author);

    // Open Graph tags
    updateOrCreateMeta("og:title", title, true);
    updateOrCreateMeta("og:description", description, true);
    updateOrCreateMeta("og:type", type, true);
    updateOrCreateMeta("og:image", image, true);
    updateOrCreateMeta("og:site_name", siteName, true);
    
    if (url) updateOrCreateMeta("og:url", url, true);
    if (publishedTime && type === "article") {
      updateOrCreateMeta("article:published_time", publishedTime, true);
      updateOrCreateMeta("article:author", author, true);
    }

    // Twitter Card tags
    updateOrCreateMeta("twitter:card", "summary_large_image");
    updateOrCreateMeta("twitter:title", title);
    updateOrCreateMeta("twitter:description", description);
    updateOrCreateMeta("twitter:image", image);

    // Structured Data (JSON-LD)
    if (structuredData) {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      // Note: In a real app, you might want to restore default meta tags
      // For this implementation, we'll leave the tags as they help with SEO
    };
  }, [title, description, keywords, image, url, type, publishedTime, author, siteName, structuredData]);

  return null; // This component doesn't render anything visible
}