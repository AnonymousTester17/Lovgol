import { type ServicePreview, type InsertServicePreview, type ContactSubmission, type InsertContactSubmission, type InquirySubmission, type InsertInquirySubmission, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { randomUUID } from "crypto";

// Define Project and CaseStudy types (assuming they are defined in @shared/schema)
// For demonstration purposes, let's define them here if they are not exported from @shared/schema
interface Project {
  id: string;
  title: string;
  description: string;
  currentProgress: number;
  progressDescription: string;
  estimatedDeliveryDays: number;
  deliveredState: "completed" | "pending";
  paymentState: "pending" | "partial" | "completed";
  milestones: { id: string; description: string; status: "completed" | "pending" }[];
  teamUpdates: string[];
  clientFeedback: string[];
  nextSteps: string[];
  riskTracker: { id: string; description: string; status: "resolved" | "open" }[];
  overallHealth: "green" | "yellow" | "red";
  clientLink: string;
  createdAt: Date;
  updatedAt: Date;
}

interface InsertProject {
  title: string;
  description: string;
  currentProgress: number;
  progressDescription: string;
  estimatedDeliveryDays: number;
  deliveredState?: "completed" | "pending";
  paymentState?: "pending" | "partial" | "completed";
  milestones?: { description: string; status: "completed" | "pending" }[];
  teamUpdates?: string[];
  clientFeedback?: string[];
  nextSteps?: string[];
  riskTracker?: { description: string; status: "resolved" | "open" }[];
  overallHealth?: "green" | "yellow" | "red";
}

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  projectLink?: string;
  clientName?: string;
  slug: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface InsertCaseStudy {
  title: string;
  description: string;
  imageUrl?: string | null;
  projectLink?: string;
  clientName?: string;
  slug: string;
  tags: string[];
}

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

  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: string): Promise<boolean>;

  // Case Studies
  createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy>;
  getCaseStudies(): Promise<CaseStudy[]>;
  getCaseStudy(id: string): Promise<CaseStudy | undefined>;
  getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined>;
  updateCaseStudy(id: string, caseStudy: Partial<InsertCaseStudy>): Promise<CaseStudy>;
  deleteCaseStudy(id: string): Promise<boolean>;

  // Projects
  createProject(project: InsertProject): Promise<Project>;
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private servicePreviews: Map<string, ServicePreview>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private inquirySubmissions: Map<string, InquirySubmission>;
  private blogPosts: Map<string, BlogPost>;
  private caseStudies: Map<string, CaseStudy>;
  private projects: Map<string, Project>;

  constructor() {
    this.servicePreviews = new Map();
    this.contactSubmissions = new Map();
    this.inquirySubmissions = new Map();
    this.blogPosts = new Map();
    this.caseStudies = new Map();
    this.projects = new Map();

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

    // Initialize sample blog posts
    const blogPostsData: InsertBlogPost[] = [
      {
        title: "The Future of Web Development: Trends to Watch in 2024",
        slug: "future-web-development-trends-2024",
        excerpt: "Discover the latest trends shaping the web development landscape and how they'll impact your next project.",
        content: `# The Future of Web Development: Trends to Watch in 2024

As we move forward in the digital age, web development continues to evolve at an unprecedented pace. At LOVGOL, we stay at the forefront of these changes to deliver cutting-edge solutions to our clients.

## 1. AI-Powered Development

Artificial Intelligence is revolutionizing how we build websites and applications. From automated code generation to intelligent testing, AI tools are making development faster and more efficient.

## 2. Progressive Web Apps (PWAs)

PWAs continue to bridge the gap between web and mobile applications, offering native-like experiences with web technologies.

## 3. Serverless Architecture

The shift towards serverless computing is enabling more scalable and cost-effective solutions.

## Conclusion

These trends represent exciting opportunities for businesses to enhance their digital presence. At LOVGOL, we're ready to help you navigate these changes.`,
        featuredImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        category: "Technology",
        tags: ["Web Development", "AI", "PWA", "Serverless"],
        isPublished: true,
        publishedAt: new Date("2024-01-15"),
      },
      {
        title: "Mobile App Development: Native vs Cross-Platform in 2024",
        slug: "mobile-app-native-vs-cross-platform-2024",
        excerpt: "Compare the advantages of native and cross-platform development approaches for your mobile app project.",
        content: `# Mobile App Development: Native vs Cross-Platform in 2024

Choosing the right development approach for your mobile app is crucial for success. Let's explore the pros and cons of each approach.

## Native Development

Native apps offer the best performance and platform-specific features but require separate codebases.

### Advantages:
- Superior performance
- Full access to device features
- Platform-specific UI/UX

## Cross-Platform Development

Tools like React Native and Flutter allow code sharing across platforms.

### Advantages:
- Faster development
- Cost-effective
- Single codebase

## Our Recommendation

At LOVGOL, we help you choose the right approach based on your specific needs, budget, and timeline.`,
        featuredImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        category: "Mobile Development",
        tags: ["Mobile Apps", "React Native", "Flutter", "iOS", "Android"],
        isPublished: true,
        publishedAt: new Date("2024-01-10"),
      },
      {
        title: "Automation Success Story: How We Saved DataCorp 500K Annually",
        slug: "automation-success-story-datacorp",
        excerpt: "Learn how our automation solutions transformed DataCorp's operations and delivered massive cost savings.",
        content: `# Automation Success Story: How We Saved DataCorp 500K Annually

At LOVGOL, we believe in the power of automation to transform businesses. Here's how we helped DataCorp revolutionize their operations.

## The Challenge

DataCorp was processing millions of records manually, leading to:
- High operational costs
- Human errors
- Slow processing times

## Our Solution

We implemented a comprehensive automation pipeline using:
- Python for data processing
- Apache Kafka for real-time streaming
- Docker for containerization
- Kubernetes for orchestration

## Results

- 95% reduction in processing time
- 99.9% accuracy improvement
- $500K annual cost savings
- Zero manual intervention required

## Conclusion

This project showcases the transformative power of intelligent automation when applied strategically.`,
        featuredImage: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        category: "Case Studies",
        tags: ["Automation", "Python", "Case Study", "ROI"],
        isPublished: true,
        publishedAt: new Date("2024-01-05"),
      }
    ];

    blogPostsData.forEach(postData => {
      const id = randomUUID();
      const blogPost: BlogPost = {
        ...postData,
        id,
        tags: postData.tags as string[],
        featuredImage: postData.featuredImage || null,
        publishedAt: postData.publishedAt || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.blogPosts.set(id, blogPost);
    });

    // Initialize sample case studies
    const caseStudiesData: InsertCaseStudy[] = [
      {
        title: "Revolutionizing E-commerce with MERN Stack",
        description: "Developed a scalable e-commerce platform that increased sales by 30%.",
        clientName: "ShopNow Inc.",
        projectLink: "/projects/e-commerce-mern",
        slug: "ecommerce-mern-stack",
        tags: ["E-commerce", "MERN", "Scalability"],
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      },
      {
        title: "Data-Driven Insights with React Dashboard",
        description: "Built a real-time analytics dashboard for better business intelligence.",
        clientName: "Data Insights Corp.",
        projectLink: "/projects/analytics-dashboard",
        slug: "analytics-dashboard-react",
        tags: ["Analytics", "React", "Data Visualization"],
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
      }
    ];

    caseStudiesData.forEach(caseStudyData => {
      const id = randomUUID();
      const caseStudy: CaseStudy = {
        ...caseStudyData,
        id,
        tags: caseStudyData.tags as string[],
        imageUrl: caseStudyData.imageUrl || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.caseStudies.set(id, caseStudy);
    });

    // Initialize sample projects
    const projectsData: InsertProject[] = [
      {
        title: "Project Alpha",
        description: "Developing a new mobile application for task management.",
        currentProgress: 75,
        progressDescription: "Completed UI design and core feature implementation. Started API integration.",
        estimatedDeliveryDays: 15,
        deliveredState: "pending",
        paymentState: "partial",
        milestones: [
          { description: "UI Design Complete", status: "completed" },
          { description: "Core Features Implemented", status: "completed" },
          { description: "API Integration", status: "pending" },
          { description: "Testing and QA", status: "pending" },
        ],
        teamUpdates: ["Day 10: API integration is proceeding smoothly."],
        clientFeedback: ["Client is happy with the current progress and UI."],
        nextSteps: ["Continue API integration", "Begin unit testing"],
        riskTracker: [{ description: "Potential delay in third-party API availability", status: "open" }],
        overallHealth: "yellow",
      },
      {
        title: "Project Beta",
        description: "Enhancing an existing e-commerce platform.",
        currentProgress: 90,
        progressDescription: "Finalizing performance optimizations and security updates.",
        estimatedDeliveryDays: 5,
        deliveredState: "pending",
        paymentState: "completed",
        milestones: [
          { description: "Feature Development", status: "completed" },
          { description: "Performance Optimization", status: "completed" },
          { description: "Security Audit", status: "pending" },
        ],
        teamUpdates: ["Day 20: Security audit scheduled for tomorrow."],
        clientFeedback: ["Client requested minor adjustments to the checkout flow."],
        nextSteps: ["Complete security audit", "Deploy to staging environment"],
        riskTracker: [],
        overallHealth: "green",
      }
    ];

    projectsData.forEach(projectData => {
      const id = randomUUID();
      const clientLink = `http://localhost:3000/projects/${id}/status`; // Example client link
      const project: Project = {
        ...projectData,
        id,
        milestones: projectData.milestones || [],
        teamUpdates: projectData.teamUpdates || [],
        clientFeedback: projectData.clientFeedback || [],
        nextSteps: projectData.nextSteps || [],
        riskTracker: projectData.riskTracker || [],
        deliveredState: projectData.deliveredState || "pending",
        paymentState: projectData.paymentState || "pending",
        overallHealth: projectData.overallHealth || "green",
        clientLink: clientLink,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.projects.set(id, project);
    });
  }

  // Service Preview Methods
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

  // Contact Submission Methods
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

  // Inquiry Submission Methods
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

  // Blog Post Methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.isPublished)
      .sort((a, b) => {
        const aDate = a.publishedAt || a.createdAt;
        const bDate = b.publishedAt || b.createdAt;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const blogPost: BlogPost = {
      ...insertPost,
      id,
      tags: insertPost.tags as string[],
      featuredImage: insertPost.featuredImage || null,
      publishedAt: insertPost.publishedAt || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: string, updatePost: Partial<InsertBlogPost>): Promise<BlogPost> {
    const existing = this.blogPosts.get(id);
    if (!existing) {
      throw new Error("Blog post not found");
    }

    const updated: BlogPost = {
      ...existing,
      ...updatePost,
      tags: updatePost.tags !== undefined ? (updatePost.tags as string[]) : existing.tags,
      featuredImage: updatePost.featuredImage !== undefined ? (updatePost.featuredImage || null) : existing.featuredImage,
      publishedAt: updatePost.publishedAt !== undefined ? updatePost.publishedAt : existing.publishedAt,
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Case Study Methods
  async createCaseStudy(insertCaseStudy: InsertCaseStudy): Promise<CaseStudy> {
    const id = randomUUID();
    const caseStudy: CaseStudy = {
      ...insertCaseStudy,
      id,
      tags: insertCaseStudy.tags as string[],
      imageUrl: insertCaseStudy.imageUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.caseStudies.set(id, caseStudy);
    return caseStudy;
  }

  async getCaseStudies(): Promise<CaseStudy[]> {
    return Array.from(this.caseStudies.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getCaseStudy(id: string): Promise<CaseStudy | undefined> {
    return this.caseStudies.get(id);
  }

  async getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
    return Array.from(this.caseStudies.values()).find(cs => cs.slug === slug);
  }

  async updateCaseStudy(id: string, updateCaseStudy: Partial<InsertCaseStudy>): Promise<CaseStudy> {
    const existing = this.caseStudies.get(id);
    if (!existing) {
      throw new Error("Case study not found");
    }

    const updated: CaseStudy = {
      ...existing,
      ...updateCaseStudy,
      tags: updateCaseStudy.tags !== undefined ? (updateCaseStudy.tags as string[]) : existing.tags,
      imageUrl: updateCaseStudy.imageUrl !== undefined ? (updateCaseStudy.imageUrl || null) : existing.imageUrl,
      updatedAt: new Date(),
    };
    this.caseStudies.set(id, updated);
    return updated;
  }

  async deleteCaseStudy(id: string): Promise<boolean> {
    return this.caseStudies.delete(id);
  }

  // Project Methods
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const clientLink = `http://localhost:3000/projects/${id}/status`; // Example client link
    const project: Project = {
      ...insertProject,
      id,
      milestones: insertProject.milestones || [],
      teamUpdates: insertProject.teamUpdates || [],
      clientFeedback: insertProject.clientFeedback || [],
      nextSteps: insertProject.nextSteps || [],
      riskTracker: insertProject.riskTracker || [],
      deliveredState: insertProject.deliveredState || "pending",
      paymentState: insertProject.paymentState || "pending",
      overallHealth: insertProject.overallHealth || "green",
      clientLink: clientLink,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async updateProject(id: string, updateProject: Partial<InsertProject>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) {
      throw new Error("Project not found");
    }

    const updated: Project = {
      ...existing,
      ...updateProject,
      milestones: updateProject.milestones !== undefined ? updateProject.milestones : existing.milestones,
      teamUpdates: updateProject.teamUpdates !== undefined ? updateProject.teamUpdates : existing.teamUpdates,
      clientFeedback: updateProject.clientFeedback !== undefined ? updateProject.clientFeedback : existing.clientFeedback,
      nextSteps: updateProject.nextSteps !== undefined ? updateProject.nextSteps : existing.nextSteps,
      riskTracker: updateProject.riskTracker !== undefined ? updateProject.riskTracker : existing.riskTracker,
      deliveredState: updateProject.deliveredState || existing.deliveredState,
      paymentState: updateProject.paymentState || existing.paymentState,
      overallHealth: updateProject.overallHealth || existing.overallHealth,
      updatedAt: new Date(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }
}

export const storage = new MemStorage();