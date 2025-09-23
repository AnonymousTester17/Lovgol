import { type ServicePreview, type InsertServicePreview, type ContactSubmission, type InsertContactSubmission, type InquirySubmission, type InsertInquirySubmission } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Service Previews
  getServicePreviews(): Promise<ServicePreview[]>;
  getServicePreviewsByCategory(category: string): Promise<ServicePreview[]>;
  getServicePreviewsByTechnology(technology: string): Promise<ServicePreview[]>;
  getServicePreview(id: string): Promise<ServicePreview | undefined>;
  createServicePreview(preview: InsertServicePreview): Promise<ServicePreview>;
  updateServicePreview(id: string, preview: Partial<InsertServicePreview>): Promise<ServicePreview>;
  deleteServicePreview(id: string): Promise<boolean>;
  
  // Contact Submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  
  // Inquiry Submissions
  createInquirySubmission(submission: InsertInquirySubmission): Promise<InquirySubmission>;
  getInquirySubmissions(): Promise<InquirySubmission[]>;
}

export class MemStorage implements IStorage {
  private servicePreviews: Map<string, ServicePreview>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private inquirySubmissions: Map<string, InquirySubmission>;

  constructor() {
    this.servicePreviews = new Map();
    this.contactSubmissions = new Map();
    this.inquirySubmissions = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Website Development samples
    const webPreviews: InsertServicePreview[] = [
      {
        title: "E-commerce Platform",
        description: "Full-featured online store with payment integration",
        category: "web",
        technology: "mern",
        tags: ["React", "MongoDB", "E-commerce"],
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      },
      {
        title: "Analytics Dashboard",
        description: "Real-time data visualization and reporting",
        category: "web",
        technology: "mern",
        tags: ["React", "Express", "Analytics"],
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      },
      {
        title: "Corporate Website",
        description: "Professional business presence with CMS",
        category: "web",
        technology: "php",
        tags: ["PHP", "MySQL", "CMS"],
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      },
      {
        title: "Content Platform",
        description: "Custom WordPress solution with advanced features",
        category: "web",
        technology: "wordpress",
        tags: ["WordPress", "Custom Theme"],
        imageUrl: "https://pixabay.com/get/gb31d541cfec4dcaca1f4e0b246e16b2654e28cb7b833e1a5895efb445663ea56a429097eb7be110a47c550ff0505e904c7cf2d1444d18825318a4d74a48de3d5_1280.jpg"
      }
    ];

    // App Development samples
    const appPreviews: InsertServicePreview[] = [
      {
        title: "Social Media App",
        description: "Cross-platform social networking application",
        category: "app",
        technology: "react-native",
        tags: ["React Native", "iOS", "Android"],
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      },
      {
        title: "Fitness Tracker",
        description: "Health and fitness tracking mobile app",
        category: "app",
        technology: "flutter",
        tags: ["Flutter", "Dart"],
        imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      },
      {
        title: "Shopping App",
        description: "Mobile e-commerce with secure payments",
        category: "app",
        technology: "react-native",
        tags: ["React Native", "Payment"],
        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      },
      {
        title: "Learning Platform",
        description: "Interactive educational mobile application",
        category: "app",
        technology: "flutter",
        tags: ["Flutter", "Education"],
        imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      }
    ];

    // Automation samples
    const automationPreviews: InsertServicePreview[] = [
      {
        title: "Data Processing",
        description: "Automated data analysis and reporting",
        category: "automation",
        technology: "python",
        tags: ["Python", "pandas"],
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      },
      {
        title: "API Integration",
        description: "Seamless third-party service automation",
        category: "automation",
        technology: "nodejs",
        tags: ["Node.js", "API"],
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      },
      {
        title: "Web Scraping",
        description: "Automated data extraction and monitoring",
        category: "automation",
        technology: "python",
        tags: ["Python", "Scraping"],
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      },
      {
        title: "Process Automation",
        description: "Business workflow and task automation",
        category: "automation",
        technology: "nodejs",
        tags: ["Node.js", "Workflow"],
        imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      }
    ];

    [...webPreviews, ...appPreviews, ...automationPreviews].forEach(preview => {
      const id = randomUUID();
      const servicePreview: ServicePreview = {
        ...preview,
        id,
        tags: (preview.tags as string[]) || [],
        imageUrl: preview.imageUrl || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.servicePreviews.set(id, servicePreview);
    });
  }

  async getServicePreviews(): Promise<ServicePreview[]> {
    return Array.from(this.servicePreviews.values());
  }

  async getServicePreviewsByCategory(category: string): Promise<ServicePreview[]> {
    return Array.from(this.servicePreviews.values()).filter(
      preview => preview.category === category
    );
  }

  async getServicePreviewsByTechnology(technology: string): Promise<ServicePreview[]> {
    return Array.from(this.servicePreviews.values()).filter(
      preview => preview.technology === technology
    );
  }

  async getServicePreview(id: string): Promise<ServicePreview | undefined> {
    return this.servicePreviews.get(id);
  }

  async createServicePreview(insertPreview: InsertServicePreview): Promise<ServicePreview> {
    const id = randomUUID();
    const servicePreview: ServicePreview = {
      ...insertPreview,
      id,
      tags: (insertPreview.tags as string[]) || [],
      imageUrl: insertPreview.imageUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.servicePreviews.set(id, servicePreview);
    return servicePreview;
  }

  async updateServicePreview(id: string, updatePreview: Partial<InsertServicePreview>): Promise<ServicePreview> {
    const existing = this.servicePreviews.get(id);
    if (!existing) {
      throw new Error("Service preview not found");
    }
    
    const updated: ServicePreview = {
      ...existing,
      ...updatePreview,
      tags: (updatePreview.tags as string[]) || existing.tags,
      imageUrl: updatePreview.imageUrl !== undefined ? (updatePreview.imageUrl || null) : existing.imageUrl,
      updatedAt: new Date(),
    };
    this.servicePreviews.set(id, updated);
    return updated;
  }

  async deleteServicePreview(id: string): Promise<boolean> {
    return this.servicePreviews.delete(id);
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const contactSubmission: ContactSubmission = {
      ...submission,
      id,
      service: submission.service || null,
      budget: submission.budget || null,
      submittedAt: new Date(),
    };
    this.contactSubmissions.set(id, contactSubmission);
    return contactSubmission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }

  async createInquirySubmission(submission: InsertInquirySubmission): Promise<InquirySubmission> {
    const id = randomUUID();
    const inquirySubmission: InquirySubmission = {
      ...submission,
      id,
      submittedAt: new Date(),
    };
    this.inquirySubmissions.set(id, inquirySubmission);
    return inquirySubmission;
  }

  async getInquirySubmissions(): Promise<InquirySubmission[]> {
    return Array.from(this.inquirySubmissions.values());
  }
}

export const storage = new MemStorage();
