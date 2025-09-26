import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";
import type { 
  InsertServicePreview, 
  InsertContactSubmission, 
  InsertInquirySubmission, 
  InsertBlogPost, 
  InsertCaseStudy, 
  InsertProject, 
  InsertBlogReaction,
  InsertAdmin
} from "@shared/schema";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export const storage = {
  // --- Admin Methods ---
  getAdminByUsername: async (username: string) => {
    return await db.query.admins.findFirst({
      where: eq(schema.admins.username, username),
    });
  },
  
  getAdminById: async (id: string) => {
    return await db.query.admins.findFirst({
      where: eq(schema.admins.id, id),
    });
  },

  createAdmin: async (admin: InsertAdmin) => {
    return await db.insert(schema.admins).values(admin).returning();
  },

  // --- Service Previews ---
  getServicePreviews: async () => {
    return await db.query.servicesPreviews.findMany();
  },
  getServicePreviewsByCategory: async (category: string) => {
    return await db.query.servicesPreviews.findMany({
      where: eq(schema.servicesPreviews.category, category),
    });
  },
  getServicePreviewsByTechnology: async (technology: string) => {
    return await db.query.servicesPreviews.findMany({
      where: eq(schema.servicesPreviews.technology, technology),
    });
  },
  getServicePreview: async (id: string) => {
    return await db.query.servicesPreviews.findFirst({
      where: eq(schema.servicesPreviews.id, id),
    });
  },
  createServicePreview: async (preview: InsertServicePreview) => {
    return (await db.insert(schema.servicesPreviews).values(preview).returning())[0];
  },
  updateServicePreview: async (id: string, preview: Partial<InsertServicePreview>) => {
    return (await db.update(schema.servicesPreviews).set(preview).where(eq(schema.servicesPreviews.id, id)).returning())[0];
  },
  deleteServicePreview: async (id: string) => {
    await db.delete(schema.servicesPreviews).where(eq(schema.servicesPreviews.id, id));
    return true;
  },

  // --- Submissions ---
  createContactSubmission: async (submission: InsertContactSubmission) => {
    return (await db.insert(schema.contactSubmissions).values(submission).returning())[0];
  },
  getContactSubmissions: async () => {
    return await db.query.contactSubmissions.findMany();
  },
  createInquirySubmission: async (submission: InsertInquirySubmission) => {
    return (await db.insert(schema.inquirySubmissions).values(submission).returning())[0];
  },
  getInquirySubmissions: async () => {
    return await db.query.inquirySubmissions.findMany();
  },
  
  // --- Blog Posts ---
  getPublishedBlogPosts: async () => {
    return await db.query.blogPosts.findMany({
        where: eq(schema.blogPosts.isPublished, true),
        orderBy: (posts, { desc }) => [desc(posts.publishedAt)],
    });
  },
  getBlogPosts: async () => {
    return await db.query.blogPosts.findMany({
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  },
  getBlogPost: async (id: string) => {
    return await db.query.blogPosts.findFirst({
      where: eq(schema.blogPosts.id, id),
    });
  },
  getBlogPostBySlug: async (slug: string) => {
    return await db.query.blogPosts.findFirst({
      where: eq(schema.blogPosts.slug, slug),
    });
  },
  createBlogPost: async (post: InsertBlogPost) => {
    return (await db.insert(schema.blogPosts).values(post).returning())[0];
  },
  updateBlogPost: async (id: string, post: Partial<InsertBlogPost>) => {
    return (await db.update(schema.blogPosts).set(post).where(eq(schema.blogPosts.id, id)).returning())[0];
  },
  deleteBlogPost: async (id: string) => {
    await db.delete(schema.blogReactions).where(eq(schema.blogReactions.postId, id));
    await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
    return true;
  },
  incrementBlogPostView: async (id: string) => {
    const post = await db.query.blogPosts.findFirst({ where: eq(schema.blogPosts.id, id) });
    if (post) {
      const newViewCount = (parseInt(post.viewCount || "0", 10) + 1).toString();
      await db.update(schema.blogPosts).set({ viewCount: newViewCount }).where(eq(schema.blogPosts.id, id));
    }
  },

  // --- Case Studies ---
  getCaseStudies: async () => {
    return await db.query.caseStudies.findMany();
  },
  getCaseStudy: async (id: string) => {
    return await db.query.caseStudies.findFirst({
      where: eq(schema.caseStudies.id, id),
    });
  },
  getCaseStudyBySlug: async (slug: string) => {
    return await db.query.caseStudies.findFirst({
      where: eq(schema.caseStudies.slug, slug),
    });
  },
  createCaseStudy: async (caseStudy: InsertCaseStudy) => {
    return (await db.insert(schema.caseStudies).values(caseStudy).returning())[0];
  },
  updateCaseStudy: async (id: string, caseStudy: Partial<InsertCaseStudy>) => {
    return (await db.update(schema.caseStudies).set(caseStudy).where(eq(schema.caseStudies.id, id)).returning())[0];
  },
  deleteCaseStudy: async (id: string) => {
    await db.delete(schema.caseStudies).where(eq(schema.caseStudies.id, id));
    return true;
  },

  // --- Projects ---
  getProjects: async () => {
    return await db.query.projects.findMany();
  },
  getProject: async (id: string) => {
    return await db.query.projects.findFirst({
      where: eq(schema.projects.id, id),
    });
  },
  getProjectByToken: async (token: string) => {
    return await db.query.projects.findFirst({
      where: eq(schema.projects.clientAccessToken, token),
    });
  },
  createProject: async (project: InsertProject) => {
    const clientAccessToken = crypto.randomUUID();
    return (await db.insert(schema.projects).values({ ...project, clientAccessToken }).returning())[0];
  },
  updateProject: async (id: string, project: Partial<InsertProject>) => {
    return (await db.update(schema.projects).set(project).where(eq(schema.projects.id, id)).returning())[0];
  },
  deleteProject: async (id: string) => {
    await db.delete(schema.projects).where(eq(schema.projects.id, id));
    return true;
  },

  // --- Blog Reactions ---
  getBlogReactions: async () => {
    return await db.query.blogReactions.findMany();
  },
  getBlogReactionsByPostId: async (postId: string) => {
    return await db.query.blogReactions.findMany({
      where: eq(schema.blogReactions.postId, postId),
    });
  },
  createBlogReaction: async (reaction: InsertBlogReaction) => {
    return (await db.insert(schema.blogReactions).values(reaction).returning())[0];
  },
};