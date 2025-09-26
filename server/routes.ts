import type { Express, Router } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertServicePreviewSchema, 
  insertContactSubmissionSchema, 
  insertInquirySubmissionSchema, 
  insertBlogPostSchema, 
  insertCaseStudySchema, 
  insertProjectSchema, 
  insertBlogReactionSchema 
} from "@shared/schema";
import passport from "passport";
import { ensureAuthenticated } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // --- PUBLIC API ROUTES ---
  // These routes are accessible to everyone.

  // Service Previews
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

  // Contact & Inquiry Submissions
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

  // Blog Posts
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/slug/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.isPublished) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      try {
        await storage.incrementBlogPostView(post.id);
      } catch (viewError) {
        console.log("Failed to increment view count:", viewError);
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Case Studies
  app.get("/api/case-studies", async (req, res) => {
    try {
      const caseStudies = await storage.getCaseStudies();
      res.json(caseStudies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case studies" });
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
  
  // Client Project View
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

  // Blog Reactions
  app.get("/api/blog-reactions", async (req, res) => {
    try {
      const { postId } = req.query;
      let reactions;
      
      if (postId && typeof postId === 'string') {
        reactions = await storage.getBlogReactionsByPostId(postId);
      } else {
        reactions = await storage.getBlogReactions();
      }
      
      res.json(reactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog reactions" });
    }
  });

  app.post("/api/blog-reactions", async (req, res) => {
    try {
      const validatedData = insertBlogReactionSchema.parse(req.body);
      const reaction = await storage.createBlogReaction(validatedData);
      res.status(201).json(reaction);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create blog reaction" });
      }
    }
  });


  // --- AUTHENTICATION ROUTES ---
  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Logged in successfully', user: req.user });
  });

  app.post('/api/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) { return next(err); }
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/auth/status', (req, res) => {
    res.json({ isAuthenticated: req.isAuthenticated() });
  });


  // --- ADMIN PROTECTED ROUTES ---
  const adminRouter: Router = express.Router();
  adminRouter.use(ensureAuthenticated);
  
  // Service Previews (Admin)
  adminRouter.post("/service-previews", async (req, res) => {
    try {
      const validatedData = insertServicePreviewSchema.parse(req.body);
      const preview = await storage.createServicePreview(validatedData);
      res.status(201).json(preview);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
  });
  
  adminRouter.put("/service-previews/:id", async (req, res) => {
    try {
      const validatedData = insertServicePreviewSchema.partial().parse(req.body);
      const preview = await storage.updateServicePreview(req.params.id, validatedData);
      res.json(preview);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
  });
  
  adminRouter.delete("/service-previews/:id", async (req, res) => {
    try {
      await storage.deleteServicePreview(req.params.id);
      res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Failed to delete service preview" });
    }
  });

  // Submissions (Admin)
  adminRouter.get("/contact-submissions", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

  adminRouter.get("/inquiry-submissions", async (req, res) => {
    try {
      const submissions = await storage.getInquirySubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiry submissions" });
    }
  });

  // Blog Posts (Admin)
  adminRouter.get("/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(); // Get all posts, including drafts
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  
  adminRouter.post("/blog-posts", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  adminRouter.put("/blog-posts/:id", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, validatedData);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  adminRouter.delete("/blog-posts/:id", async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Case Studies (Admin)
  adminRouter.post("/case-studies", async (req, res) => {
    try {
      const validatedData = insertCaseStudySchema.parse(req.body);
      const caseStudy = await storage.createCaseStudy(validatedData);
      res.status(201).json(caseStudy);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  adminRouter.put("/case-studies/:id", async (req, res) => {
    try {
      const validatedData = insertCaseStudySchema.partial().parse(req.body);
      const caseStudy = await storage.updateCaseStudy(req.params.id, validatedData);
      res.json(caseStudy);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  adminRouter.delete("/case-studies/:id", async (req, res) => {
    try {
      await storage.deleteCaseStudy(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete case study" });
    }
  });

  // Projects (Admin)
  adminRouter.get("/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  
  adminRouter.post("/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  adminRouter.put("/projects/:id", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, validatedData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  adminRouter.delete("/projects/:id", async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Register the admin router
  app.use('/api/admin', adminRouter);


  const httpServer = createServer(app);
  return httpServer;
}