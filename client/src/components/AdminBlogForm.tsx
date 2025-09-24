
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { BlogPost } from "@shared/schema";

const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  isPublished: z.boolean(),
});

type BlogFormData = z.infer<typeof blogFormSchema>;

interface AdminBlogFormProps {
  blogPost: BlogPost | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminBlogForm({ blogPost, onSuccess, onCancel }: AdminBlogFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentPreview, setContentPreview] = useState(false);

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      category: "Technology",
      isPublished: false,
    },
  });

  useEffect(() => {
    if (blogPost) {
      form.reset({
        title: blogPost.title,
        slug: blogPost.slug,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        featuredImage: blogPost.featuredImage || "",
        category: blogPost.category,
        isPublished: blogPost.isPublished,
      });
      setTags(blogPost.tags || []);
    } else {
      setTags([]);
    }
  }, [blogPost, form]);

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    form.setValue("title", value);
    if (!blogPost) { // Only auto-generate slug for new posts
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue("slug", slug);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: BlogFormData & { tags: string[] }) => {
      return await apiRequest("POST", "/api/blog-posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({
        title: "Blog post created",
        description: "Blog post has been created successfully.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create blog post.",
        variant: "destructive",
      });
    },
    onSettled: () => setIsSubmitting(false),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: BlogFormData & { tags: string[] }) => {
      return await apiRequest("PUT", `/api/blog-posts/${blogPost!.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({
        title: "Blog post updated",
        description: "Blog post has been updated successfully.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update blog post.",
        variant: "destructive",
      });
    },
    onSettled: () => setIsSubmitting(false),
  });

  const onSubmit = (data: BlogFormData) => {
    setIsSubmitting(true);
    const formData = {
      ...data,
      tags: tags || [],
      featuredImage: data.featuredImage || null,
      publishedAt: data.isPublished ? new Date().toISOString() : null,
    };

    if (blogPost) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto glass-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{blogPost ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
            <Button variant="ghost" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="bg-input border-border"
                  />
                  {form.formState.errors.title && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    {...form.register("slug")}
                    className="bg-input border-border"
                  />
                  {form.formState.errors.slug && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.slug.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    {...form.register("excerpt")}
                    rows={3}
                    className="bg-input border-border"
                  />
                  {form.formState.errors.excerpt && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.excerpt.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    {...form.register("featuredImage")}
                    className="bg-input border-border"
                  />
                  {form.formState.errors.featuredImage && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.featuredImage.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    onValueChange={(value) => form.setValue("category", value)} 
                    defaultValue={form.getValues("category")}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                      <SelectItem value="Case Studies">Case Studies</SelectItem>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Automation">Automation</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.category.message}</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      className="bg-input border-border"
                    />
                    <Button type="button" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublished"
                    checked={form.watch("isPublished")}
                    onCheckedChange={(checked) => form.setValue("isPublished", checked)}
                  />
                  <Label htmlFor="isPublished">Publish immediately</Label>
                </div>
              </div>

              {/* Right Column - Content */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Content</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setContentPreview(!contentPreview)}
                  >
                    {contentPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {contentPreview ? "Edit" : "Preview"}
                  </Button>
                </div>
                
                {contentPreview ? (
                  <div className="min-h-[400px] p-4 bg-card border border-border rounded-md">
                    <div className="prose dark:prose-invert max-w-none">
                      {form.watch("content").split('\n\n').map((paragraph, index) => {
                        if (paragraph.startsWith('# ')) {
                          return <h1 key={index} className="text-2xl font-bold mb-4">{paragraph.replace('# ', '')}</h1>;
                        }
                        if (paragraph.startsWith('## ')) {
                          return <h2 key={index} className="text-xl font-semibold mb-3">{paragraph.replace('## ', '')}</h2>;
                        }
                        if (paragraph.startsWith('### ')) {
                          return <h3 key={index} className="text-lg font-medium mb-2">{paragraph.replace('### ', '')}</h3>;
                        }
                        if (paragraph.trim()) {
                          return <p key={index} className="mb-4">{paragraph}</p>;
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ) : (
                  <Textarea
                    id="content"
                    {...form.register("content")}
                    rows={20}
                    className="bg-input border-border font-mono text-sm"
                    placeholder="Write your blog content here. Use markdown syntax:&#10;# Heading 1&#10;## Heading 2&#10;### Heading 3&#10;&#10;Regular paragraph text..."
                  />
                )}
                {form.formState.errors.content && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.content.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/80"
              >
                {isSubmitting ? "Saving..." : blogPost ? "Update Blog Post" : "Create Blog Post"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
