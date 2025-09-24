import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEmailJS } from "@/hooks/useEmailJS";
import { apiRequest } from "@/lib/queryClient";
import type { Project } from "@shared/schema";

const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Valid email is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  technology: z.string().min(1, "Technology is required"),
  progressPercentage: z.string().min(1, "Progress percentage is required"),
  progressDescription: z.string().optional(),
  estimatedDeliveryDays: z.string().min(1, "Estimated delivery days is required"),
  deliveryStatus: z.enum(["pending", "completed"]),
  paymentStatus: z.enum(["pending", "partial", "completed"]),
  projectHealth: z.enum(["green", "yellow", "red"]),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

interface AdminProjectFormProps {
  project: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminProjectForm({ project, onSuccess, onCancel }: AdminProjectFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendProjectUpdateEmail } = useEmailJS();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      clientName: "",
      clientEmail: "",
      description: "",
      category: "web",
      technology: "",
      progressPercentage: "0",
      progressDescription: "",
      estimatedDeliveryDays: "30",
      deliveryStatus: "pending",
      paymentStatus: "pending",
      projectHealth: "green",
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        clientName: project.clientName,
        clientEmail: project.clientEmail,
        description: project.description,
        category: project.category,
        technology: project.technology,
        progressPercentage: project.progressPercentage,
        progressDescription: project.progressDescription || "",
        estimatedDeliveryDays: project.estimatedDeliveryDays,
        deliveryStatus: project.deliveryStatus as "pending" | "completed",
        paymentStatus: project.paymentStatus as "pending" | "partial" | "completed",
        projectHealth: project.projectHealth as "green" | "yellow" | "red",
      });
    }
  }, [project, form]);

  const createMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      return await apiRequest("POST", "/api/projects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project created",
        description: "Project has been created successfully.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project.",
        variant: "destructive",
      });
    },
    onSettled: () => setIsSubmitting(false),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      // Construct the client project link
      const clientProjectLink = `${window.location.origin}/projects/${project!.token}`;
      
      // Prepare email data
      const emailData = {
        to_email: data.clientEmail,
        client_name: data.clientName,
        project_title: data.title,
        progress_percentage: data.progressPercentage,
        progress_description: data.progressDescription || "No description provided.",
        client_project_link: clientProjectLink,
      };

      // Check if progress has actually changed
      const progressChanged = project?.progressPercentage !== data.progressPercentage ||
                              project?.progressDescription !== data.progressDescription;

      return await apiRequest("PUT", `/api/projects/${project!.id}`, { ...data, shouldSendEmail: progressChanged, emailData });
    },
    onSuccess: async (updatedProject: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });

      // Send email notification if progress was updated
      if (updatedProject.shouldSendEmail && updatedProject.emailData) {
        try {
          await sendProjectUpdateEmail(updatedProject.emailData);
          toast({
            title: "Project updated",
            description: "Project has been updated and client has been notified via email.",
          });
        } catch (emailError) {
          console.error("Email sending failed:", emailError); // Log the error for debugging
          toast({
            title: "Project updated",
            description: "Project updated successfully, but failed to send email notification.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Project updated",
          description: "Project has been updated successfully.",
        });
      }

      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => setIsSubmitting(false),
  });

  const onSubmit = (data: ProjectFormData) => {
    setIsSubmitting(true);
    if (project) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{project ? "Edit Project" : "Create New Project"}</CardTitle>
            <Button variant="ghost" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                {...form.register("title")}
                className="bg-input border-border"
              />
              {form.formState.errors.title && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  {...form.register("clientName")}
                  className="bg-input border-border"
                />
                {form.formState.errors.clientName && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.clientName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  {...form.register("clientEmail")}
                  className="bg-input border-border"
                />
                {form.formState.errors.clientEmail && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.clientEmail.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                rows={3}
                className="bg-input border-border"
              />
              {form.formState.errors.description && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => form.setValue("category", value)} defaultValue={form.getValues("category")}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="app">App Development</SelectItem>
                    <SelectItem value="automation">Automation</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="technology">Technology</Label>
                <Input
                  id="technology"
                  {...form.register("technology")}
                  className="bg-input border-border"
                />
                {form.formState.errors.technology && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.technology.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="progressPercentage">Progress (%)</Label>
                <Input
                  id="progressPercentage"
                  {...form.register("progressPercentage")}
                  className="bg-input border-border"
                />
                {form.formState.errors.progressPercentage && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.progressPercentage.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="estimatedDeliveryDays">Estimated Delivery (Days)</Label>
                <Input
                  id="estimatedDeliveryDays"
                  {...form.register("estimatedDeliveryDays")}
                  className="bg-input border-border"
                />
                {form.formState.errors.estimatedDeliveryDays && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.estimatedDeliveryDays.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="progressDescription">Progress Description</Label>
              <Textarea
                id="progressDescription"
                {...form.register("progressDescription")}
                rows={2}
                className="bg-input border-border"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="deliveryStatus">Delivery Status</Label>
                <Select onValueChange={(value) => form.setValue("deliveryStatus", value as any)} defaultValue={form.getValues("deliveryStatus")}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select onValueChange={(value) => form.setValue("paymentStatus", value as any)} defaultValue={form.getValues("paymentStatus")}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="projectHealth">Project Health</Label>
                <Select onValueChange={(value) => form.setValue("projectHealth", value as any)} defaultValue={form.getValues("projectHealth")}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/80"
              >
                {isSubmitting ? "Saving..." : project ? "Update Project" : "Create Project"}
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