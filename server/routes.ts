import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertServicePreviewSchema, insertContactSubmissionSchema, insertInquirySubmissionSchema, insertBlogPostSchema } from "@shared/schema";

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

  const httpServer = createServer(app);
  return httpServer;
}
