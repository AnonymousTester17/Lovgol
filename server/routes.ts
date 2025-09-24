import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertServicePreviewSchema, insertContactSubmissionSchema, insertInquirySubmissionSchema, insertBlogPostSchema, insertCaseStudySchema, insertProjectSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Service Previews Routes
  app.get("/api/service-previews", async (req, res) => {
    try {
      const { category, technology } = req.query;
      
      let previews;
      if (category && typeof category === 'string') {
        previews = await storage.getServicePreviewsByCategory(category);
      } else if (technology && typeof technology === 'string') {
        previews = await storage.getServicePreviewsByTechnology(technology);
      } else {
        previews = await storage.getServicePreviews();
      }
      
      res.json(previews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service previews" });
    }
  });

  app.get("/api/service-previews/:id", async (req, res) => {
    try {
      const preview = await storage.getServicePreview(req.params.id);
      if (!preview) {
        return res.status(404).json({ message: "Service preview not found" });
      }
      res.json(preview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service preview" });
    }
  });

  app.post("/api/service-previews", async (req, res) => {
    try {
      const validatedData = insertServicePreviewSchema.parse(req.body);
      const preview = await storage.createServicePreview(validatedData);
      res.status(201).json(preview);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create service preview" });
      }
    }
  });

  app.put("/api/service-previews/:id", async (req, res) => {
    try {
      const validatedData = insertServicePreviewSchema.partial().parse(req.body);
      const preview = await storage.updateServicePreview(req.params.id, validatedData);
      res.json(preview);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Service preview not found") {
          res.status(404).json({ message: error.message });
        } else {
          res.status(400).json({ message: error.message });
        }
      } else {
        res.status(500).json({ message: "Failed to update service preview" });
      }
    }
  });

  app.delete("/api/service-previews/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteServicePreview(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Service preview not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service preview" });
    }
  });

  // Contact Submissions Routes
  app.post("/api/contact-submissions", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create contact submission" });
      }
    }
  });

  app.get("/api/contact-submissions", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

  // Inquiry Submissions Routes
  app.post("/api/inquiry-submissions", async (req, res) => {
    try {
      const validatedData = insertInquirySubmissionSchema.parse(req.body);
      const submission = await storage.createInquirySubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create inquiry submission" });
      }
    }
  });

  app.get("/api/inquiry-submissions", async (req, res) => {
    try {
      const submissions = await storage.getInquirySubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiry submissions" });
    }
  });

  // Blog Posts Routes
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const { published } = req.query;
      let posts;
      
      if (published === 'true') {
        posts = await storage.getPublishedBlogPosts();
      } else {
        posts = await storage.getBlogPosts();
      }
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get("/api/blog-posts/slug/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog-posts", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create blog post" });
      }
    }
  });

  app.put("/api/blog-posts/:id", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, validatedData);
      res.json(post);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Blog post not found") {
          res.status(404).json({ message: error.message });
        } else {
          res.status(400).json({ message: error.message });
        }
      } else {
        res.status(500).json({ message: "Failed to update blog post" });
      }
    }
  });

  app.delete("/api/blog-posts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBlogPost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Case Studies Routes
  app.get("/api/case-studies", async (req, res) => {
    try {
      const caseStudies = await storage.getCaseStudies();
      res.json(caseStudies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case studies" });
    }
  });

  app.get("/api/case-studies/:id", async (req, res) => {
    try {
      const caseStudy = await storage.getCaseStudy(req.params.id);
      if (!caseStudy) {
        return res.status(404).json({ message: "Case study not found" });
      }
      res.json(caseStudy);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case study" });
    }
  });

  app.get("/api/case-studies/slug/:slug", async (req, res) => {
    try {
      const caseStudy = await storage.getCaseStudyBySlug(req.params.slug);
      if (!caseStudy) {
        return res.status(404).json({ message: "Case study not found" });
      }
      res.json(caseStudy);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case study" });
    }
  });

  app.post("/api/case-studies", async (req, res) => {
    try {
      const validatedData = insertCaseStudySchema.parse(req.body);
      const caseStudy = await storage.createCaseStudy(validatedData);
      res.status(201).json(caseStudy);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create case study" });
      }
    }
  });

  app.put("/api/case-studies/:id", async (req, res) => {
    try {
      const validatedData = insertCaseStudySchema.partial().parse(req.body);
      const caseStudy = await storage.updateCaseStudy(req.params.id, validatedData);
      res.json(caseStudy);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Case study not found") {
          res.status(404).json({ message: error.message });
        } else {
          res.status(400).json({ message: error.message });
        }
      } else {
        res.status(500).json({ message: "Failed to update case study" });
      }
    }
  });

  app.delete("/api/case-studies/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCaseStudy(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Case study not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete case study" });
    }
  });

  // Projects Routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.get("/api/client-project/:token", async (req, res) => {
    try {
      const project = await storage.getProjectByToken(req.params.token);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      // Return project without sensitive admin data
      const clientProject = {
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        technology: project.technology,
        progressPercentage: project.progressPercentage,
        progressDescription: project.progressDescription,
        estimatedDeliveryDays: project.estimatedDeliveryDays,
        deliveryStatus: project.deliveryStatus,
        paymentStatus: project.paymentStatus,
        milestones: project.milestones,
        clientFeedback: project.clientFeedback,
        projectHealth: project.projectHealth,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      };
      res.json(clientProject);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create project" });
      }
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const oldProject = await storage.getProject(req.params.id);
      const project = await storage.updateProject(req.params.id, validatedData);
      
      // Check if progress was updated and send email notification
      if (oldProject && validatedData.progressPercentage && 
          oldProject.progressPercentage !== validatedData.progressPercentage) {
        
        // Prepare email data for client notification
        const clientLink = `${req.protocol}://${req.get('host')}/client-project/${project.clientAccessToken}`;
        const emailData = {
          to_email: project.clientEmail,
          to_name: project.clientName,
          project_title: project.title,
          progress_percentage: project.progressPercentage,
          progress_description: project.progressDescription || 'No additional details provided.',
          client_link: clientLink,
          estimated_delivery: project.estimatedDeliveryDays,
          project_health: project.projectHealth,
          delivery_status: project.deliveryStatus,
          payment_status: project.paymentStatus,
        };

        // Set flag to indicate email should be sent from frontend
        (project as any).shouldSendEmail = true;
        (project as any).emailData = emailData;
      }
      
      res.json(project);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Project not found") {
          res.status(404).json({ message: error.message });
        } else {
          res.status(400).json({ message: error.message });
        }
      } else {
        res.status(500).json({ message: "Failed to update project" });
      }
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
