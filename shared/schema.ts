import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const servicesPreviews = pgTable("services_previews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'web', 'app', 'automation'
  technology: text("technology").notNull(), // 'mern', 'php', 'wordpress', 'react-native', 'flutter', 'python', 'nodejs'
  tags: json("tags").$type<string[]>().notNull().default(sql`'[]'::json`),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  service: text("service"),
  budget: text("budget"),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const inquirySubmissions = pgTable("inquiry_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  service: text("service").notNull(),
  details: text("details").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  category: text("category").notNull(),
  tags: json("tags").$type<string[]>().notNull().default(sql`'[]'::json`),
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  viewCount: text("view_count").notNull().default("0"),
  likeCount: text("like_count").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogReactions = pgTable("blog_reactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull().references(() => blogPosts.id),
  userEmail: text("user_email"),
  userName: text("user_name"),
  reactionType: text("reaction_type").notNull(), // 'like', 'love', 'insightful', 'helpful'
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const caseStudies = pgTable("case_studies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  client: text("client").notNull(),
  industry: text("industry").notNull(),
  timeline: text("timeline").notNull(),
  teamSize: text("team_size").notNull(),
  technologies: json("technologies").$type<string[]>().notNull().default(sql`'[]'::json`),
  challenge: text("challenge").notNull(),
  solution: text("solution").notNull(),
  results: json("results").$type<string[]>().notNull().default(sql`'[]'::json`),
  heroImage: text("hero_image").notNull(),
  images: json("images").$type<string[]>().notNull().default(sql`'[]'::json`),
  liveUrl: text("live_url"),
  serviceId: varchar("service_id").references(() => servicesPreviews.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  technology: text("technology").notNull(),
  
  // Progress tracking
  progressPercentage: text("progress_percentage").notNull().default("0"),
  progressDescription: text("progress_description").default(""),
  estimatedDeliveryDays: text("estimated_delivery_days").notNull().default("30"),
  deliveryStatus: text("delivery_status").notNull().default("pending"), // pending, completed
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, partial, completed
  
  // Project management
  milestones: json("milestones").$type<Array<{
    id: string;
    title: string;
    description: string;
    status: "pending" | "in_progress" | "completed";
    dueDate?: string;
  }>>().notNull().default(sql`'[]'::json`),
  
  teamUpdates: json("team_updates").$type<Array<{
    id: string;
    date: string;
    update: string;
    author: string;
  }>>().notNull().default(sql`'[]'::json`),
  
  clientFeedback: json("client_feedback").$type<Array<{
    id: string;
    date: string;
    feedback: string;
    type: "general" | "request" | "approval" | "concern";
  }>>().notNull().default(sql`'[]'::json`),
  
  nextSteps: json("next_steps").$type<Array<{
    id: string;
    task: string;
    priority: "low" | "medium" | "high";
    assignee?: string;
    dueDate?: string;
  }>>().notNull().default(sql`'[]'::json`),
  
  riskIssues: json("risk_issues").$type<Array<{
    id: string;
    title: string;
    description: string;
    severity: "low" | "medium" | "high";
    status: "open" | "resolved";
    reportedDate: string;
  }>>().notNull().default(sql`'[]'::json`),
  
  projectHealth: text("project_health").notNull().default("green"), // green, yellow, red
  
  // Client access
  clientAccessToken: text("client_access_token").notNull().unique(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertServicePreviewSchema = createInsertSchema(servicesPreviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  submittedAt: true,
});

export const insertInquirySubmissionSchema = createInsertSchema(inquirySubmissions).omit({
  id: true,
  submittedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCaseStudySchema = createInsertSchema(caseStudies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  clientAccessToken: true,
});

export const insertBlogReactionSchema = createInsertSchema(blogReactions).omit({
  id: true,
  createdAt: true,
});

export type ServicePreview = typeof servicesPreviews.$inferSelect;
export type InsertServicePreview = z.infer<typeof insertServicePreviewSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type InquirySubmission = typeof inquirySubmissions.$inferSelect;
export type InsertInquirySubmission = z.infer<typeof insertInquirySubmissionSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type CaseStudy = typeof caseStudies.$inferSelect;
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type BlogReaction = typeof blogReactions.$inferSelect;
export type InsertBlogReaction = z.infer<typeof insertBlogReactionSchema>;
