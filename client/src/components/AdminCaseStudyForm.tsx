import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { CaseStudy } from "@shared/schema";

const caseStudyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  client: z.string().min(1, "Client is required"),
  industry: z.string().min(1, "Industry is required"),
  timeline: z.string().min(1, "Timeline is required"),
  teamSize: z.string().min(1, "Team size is required"),
  challenge: z.string().min(1, "Challenge is required"),
  solution: z.string().min(1, "Solution is required"),
  heroImage: z.string().url("Must be a valid URL"),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  serviceId: z.string().optional(),
});

type CaseStudyFormData = z.infer<typeof caseStudyFormSchema>;

interface AdminCaseStudyFormProps {
  caseStudy: CaseStudy | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminCaseStudyForm({ caseStudy, onSuccess, onCancel }: AdminCaseStudyFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newTech, setNewTech] = useState("");
  const [newResult, setNewResult] = useState("");
  const [newImage, setNewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CaseStudyFormData>({
    resolver: zodResolver(caseStudyFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      client: "",
      industry: "",
      timeline: "",
      teamSize: "",
      challenge: "",
      solution: "",
      heroImage: "",
      liveUrl: "",
      serviceId: "",
    },
  });

  useEffect(() => {
    if (caseStudy) {
      form.reset({
        title: caseStudy.title,
        slug: caseStudy.slug,
        client: caseStudy.client,
        industry: caseStudy.industry,
        timeline: caseStudy.timeline,
        teamSize: caseStudy.teamSize,
        challenge: caseStudy.challenge,
        solution: caseStudy.solution,
        heroImage: caseStudy.heroImage,
        liveUrl: caseStudy.liveUrl || "",
        serviceId: caseStudy.serviceId || "",
      });
      setTechnologies(caseStudy.technologies || []);
      setResults(caseStudy.results || []);
      setImages(caseStudy.images || []);
    } else {
      // Reset arrays when creating new case study
      setTechnologies([]);
      setResults([]);
      setImages([]);
    }
  }, [caseStudy, form]);

  const createMutation = useMutation({
    mutationFn: async (data: CaseStudyFormData & { technologies: string[]; results: string[]; images: string[] }) => {
      return await apiRequest("POST", "/api/case-studies", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/case-studies"] });
      toast({
        title: "Case study created",
        description: "Case study has been created successfully.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create case study.",
        variant: "destructive",
      });
    },
    onSettled: () => setIsSubmitting(false),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CaseStudyFormData & { technologies: string[]; results: string[]; images: string[] }) => {
      return await apiRequest("PUT", `/api/case-studies/${caseStudy!.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/case-studies"] });
      toast({
        title: "Case study updated",
        description: "Case study has been updated successfully.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update case study.",
        variant: "destructive",
      });
    },
    onSettled: () => setIsSubmitting(false),
  });

  const onSubmit = (data: CaseStudyFormData) => {
    setIsSubmitting(true);
    const formData = {
      ...data,
      technologies: technologies || [],
      results: results || [],
      images: images || [],
      liveUrl: data.liveUrl || undefined,
      serviceId: data.serviceId || undefined,
    };

    if (caseStudy) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const addTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      setTechnologies([...technologies, newTech.trim()]);
      setNewTech("");
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies((technologies || []).filter(t => t !== tech));
  };

  const addResult = () => {
    if (newResult.trim()) {
      setResults([...(results || []), newResult.trim()]);
      setNewResult("");
    }
  };

  const removeResult = (index: number) => {
    setResults((results || []).filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setImages([...(images || []), newImage.trim()]);
      setNewImage("");
    }
  };

  const removeImage = (index: number) => {
    setImages((images || []).filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{caseStudy ? "Edit Case Study" : "Create New Case Study"}</CardTitle>
            <Button variant="ghost" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...form.register("title")}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  {...form.register("client")}
                  className="bg-input border-border"
                />
                {form.formState.errors.client && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.client.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  {...form.register("industry")}
                  className="bg-input border-border"
                />
                {form.formState.errors.industry && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.industry.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  {...form.register("timeline")}
                  className="bg-input border-border"
                />
                {form.formState.errors.timeline && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.timeline.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  {...form.register("teamSize")}
                  className="bg-input border-border"
                />
                {form.formState.errors.teamSize && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.teamSize.message}</p>
                )}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <Label>Technologies</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Add technology"
                  className="bg-input border-border"
                />
                <Button type="button" onClick={addTechnology}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {technologies && technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="challenge">Challenge</Label>
              <Textarea
                id="challenge"
                {...form.register("challenge")}
                rows={4}
                className="bg-input border-border"
              />
              {form.formState.errors.challenge && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.challenge.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="solution">Solution</Label>
              <Textarea
                id="solution"
                {...form.register("solution")}
                rows={4}
                className="bg-input border-border"
              />
              {form.formState.errors.solution && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.solution.message}</p>
              )}
            </div>

            {/* Results */}
            <div>
              <Label>Results</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newResult}
                  onChange={(e) => setNewResult(e.target.value)}
                  placeholder="Add result"
                  className="bg-input border-border"
                />
                <Button type="button" onClick={addResult}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {results && results.length > 0 ? results.map((result, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-card rounded">
                    <span className="flex-1">{result}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResult(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No results added yet.</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="heroImage">Hero Image URL</Label>
              <Input
                id="heroImage"
                {...form.register("heroImage")}
                className="bg-input border-border"
              />
              {form.formState.errors.heroImage && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.heroImage.message}</p>
              )}
            </div>

            {/* Project Images */}
            <div>
              <Label>Project Images</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Add image URL"
                  className="bg-input border-border"
                />
                <Button type="button" onClick={addImage}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {images && images.length > 0 ? images.map((image, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-card rounded">
                    <img src={image} alt={`Project ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                    <span className="flex-1 text-sm">{image}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No images added yet.</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="liveUrl">Live URL (Optional)</Label>
              <Input
                id="liveUrl"
                {...form.register("liveUrl")}
                className="bg-input border-border"
              />
              {form.formState.errors.liveUrl && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.liveUrl.message}</p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/80"
              >
                {isSubmitting ? "Saving..." : caseStudy ? "Update Case Study" : "Create Case Study"}
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