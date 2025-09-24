import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit, Plus, ExternalLink, Eye, Copy } from "lucide-react";
import AdminServiceForm from "@/components/AdminServiceForm";
import AdminCaseStudyForm from "@/components/AdminCaseStudyForm";
import AdminProjectForm from "@/components/AdminProjectForm";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ServicePreview, CaseStudy, Project } from "@shared/schema";

export default function Admin() {
  const [editingService, setEditingService] = useState<ServicePreview | null>(null);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showCaseStudyForm, setShowCaseStudyForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: servicePreviews = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/service-previews"],
  });

  const { data: caseStudies = [], isLoading: caseStudiesLoading } = useQuery({
    queryKey: ["/api/case-studies"],
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: contactSubmissions = [], isLoading: contactsLoading } = useQuery({
    queryKey: ["/api/contact-submissions"],
  });

  const { data: inquirySubmissions = [], isLoading: inquiriesLoading } = useQuery({
    queryKey: ["/api/inquiry-submissions"],
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/service-previews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-previews"] });
      toast({
        title: "Service deleted",
        description: "Service preview has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete service preview.",
        variant: "destructive",
      });
    },
  });

  const deleteCaseStudyMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/case-studies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/case-studies"] });
      toast({
        title: "Case study deleted",
        description: "Case study has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete case study.",
        variant: "destructive",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project deleted",
        description: "Project has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteService = (id: string) => {
    if (confirm("Are you sure you want to delete this service preview?")) {
      deleteServiceMutation.mutate(id);
    }
  };

  const handleEditService = (service: ServicePreview) => {
    setEditingService(service);
    setShowServiceForm(true);
  };

  const handleAddService = () => {
    setEditingService(null);
    setShowServiceForm(true);
  };

  const handleServiceFormSuccess = () => {
    setShowServiceForm(false);
    setEditingService(null);
  };

  const handleDeleteCaseStudy = (id: string) => {
    if (confirm("Are you sure you want to delete this case study?")) {
      deleteCaseStudyMutation.mutate(id);
    }
  };

  const handleEditCaseStudy = (caseStudy: CaseStudy) => {
    setEditingCaseStudy(caseStudy);
    setShowCaseStudyForm(true);
  };

  const handleAddCaseStudy = () => {
    setEditingCaseStudy(null);
    setShowCaseStudyForm(true);
  };

  const handleCaseStudyFormSuccess = () => {
    setShowCaseStudyForm(false);
    setEditingCaseStudy(null);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(id);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setShowProjectForm(true);
  };

  const handleProjectFormSuccess = () => {
    setShowProjectForm(false);
    setEditingProject(null);
  };

  const copyClientLink = (token: string) => {
    if (!token) {
      toast({
        title: "Error",
        description: "No client access token found for this project.",
        variant: "destructive",
      });
      return;
    }
    const link = `${window.location.origin}/client-project/${token}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Client access link has been copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8" data-testid="admin-page">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold masked-text" data-testid="text-admin-title">LOVGOL Admin Panel</h1>
          <div className="flex gap-2">
            <Button 
              onClick={handleAddService} 
              className="bg-primary hover:bg-primary/80"
              data-testid="button-add-service"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
            <Button 
              onClick={handleAddCaseStudy} 
              className="bg-secondary hover:bg-secondary/80"
              data-testid="button-add-case-study"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Case Study
            </Button>
            <Button 
              onClick={handleAddProject} 
              className="bg-accent hover:bg-accent/80"
              data-testid="button-add-project"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
        </div>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="services" data-testid="tab-services">Services ({servicePreviews.length})</TabsTrigger>
            <TabsTrigger value="case-studies" data-testid="tab-case-studies">Case Studies ({caseStudies.length})</TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">Projects ({projects.length})</TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts">Contact Submissions ({contactSubmissions.length})</TabsTrigger>
            <TabsTrigger value="inquiries" data-testid="tab-inquiries">Inquiries ({inquirySubmissions.length})</TabsTrigger>
            <TabsTrigger value="blog" data-testid="tab-blog">Blog Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            {servicesLoading ? (
              <div className="text-center py-8" data-testid="loading-services">Loading services...</div>
            ) : servicePreviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground" data-testid="empty-services">
                No service previews found. Add your first service to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicePreviews.map((service: ServicePreview) => (
                  <Card key={service.id} className="glass-card" data-testid={`card-service-${service.id}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg" data-testid={`text-service-title-${service.id}`}>
                          {service.title}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditService(service)}
                            data-testid={`button-edit-${service.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteService(service.id)}
                            data-testid={`button-delete-${service.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" data-testid={`badge-category-${service.id}`}>
                          {service.category}
                        </Badge>
                        <Badge variant="outline" data-testid={`badge-technology-${service.id}`}>
                          {service.technology}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {service.imageUrl && (
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                          data-testid={`img-service-${service.id}`}
                        />
                      )}
                      <p className="text-sm text-muted-foreground mb-4" data-testid={`text-description-${service.id}`}>
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {service.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs" data-testid={`tag-${service.id}-${index}`}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="case-studies" className="space-y-6">
            {caseStudiesLoading ? (
              <div className="text-center py-8" data-testid="loading-case-studies">Loading case studies...</div>
            ) : caseStudies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground" data-testid="empty-case-studies">
                No case studies found. Add your first case study to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {caseStudies.map((caseStudy: CaseStudy) => (
                  <Card key={caseStudy.id} className="glass-card" data-testid={`card-case-study-${caseStudy.id}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg" data-testid={`text-case-study-title-${caseStudy.id}`}>
                          {caseStudy.title}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`/case-study/${caseStudy.slug}`, '_blank')}
                            data-testid={`button-view-${caseStudy.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCaseStudy(caseStudy)}
                            data-testid={`button-edit-case-study-${caseStudy.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCaseStudy(caseStudy.id)}
                            data-testid={`button-delete-case-study-${caseStudy.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" data-testid={`badge-industry-${caseStudy.id}`}>
                          {caseStudy.industry}
                        </Badge>
                        <Badge variant="outline" data-testid={`badge-client-${caseStudy.id}`}>
                          {caseStudy.client}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={caseStudy.heroImage}
                        alt={caseStudy.title}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                        data-testid={`img-case-study-${caseStudy.id}`}
                      />
                      <p className="text-sm text-muted-foreground mb-4" data-testid={`text-challenge-${caseStudy.id}`}>
                        {caseStudy.challenge ? caseStudy.challenge.substring(0, 120) + '...' : 'No challenge description available'}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {caseStudy.technologies && caseStudy.technologies.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs" data-testid={`tech-${caseStudy.id}-${index}`}>
                            {tech}
                          </Badge>
                        ))}
                        {caseStudy.technologies && caseStudy.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{caseStudy.technologies.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            {projectsLoading ? (
              <div className="text-center py-8" data-testid="loading-projects">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground" data-testid="empty-projects">
                No projects found. Add your first project to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project: Project) => (
                  <Card key={project.id} className="glass-card" data-testid={`card-project-${project.id}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg" data-testid={`text-project-title-${project.id}`}>
                          {project.title}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyClientLink(project.clientAccessToken || project.id)}
                            data-testid={`button-copy-link-${project.id}`}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProject(project)}
                            data-testid={`button-edit-project-${project.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProject(project.id)}
                            data-testid={`button-delete-project-${project.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" data-testid={`badge-progress-${project.id}`}>
                          {project.currentProgress || project.progressPercentage || 0}%
                        </Badge>
                        <Badge 
                          variant={(project.projectHealth || project.overallHealth) === 'green' ? 'default' : (project.projectHealth || project.overallHealth) === 'yellow' ? 'secondary' : 'destructive'} 
                          data-testid={`badge-health-${project.id}`}
                        >
                          {((project.projectHealth || project.overallHealth) || 'unknown').toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2" data-testid={`text-client-${project.id}`}>
                        <strong>Client:</strong> {project.clientName}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2" data-testid={`text-delivery-${project.id}`}>
                        <strong>Delivery:</strong> {project.estimatedDeliveryDays} days
                      </p>
                      <p className="text-sm text-muted-foreground mb-4" data-testid={`text-payment-${project.id}`}>
                        <strong>Payment:</strong> {project.paymentState || project.paymentStatus || 'pending'}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${project.currentProgress || project.progressPercentage || 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Progress: {project.currentProgress || project.progressPercentage || 0}%
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            {contactsLoading ? (
              <div className="text-center py-8" data-testid="loading-contacts">Loading contact submissions...</div>
            ) : contactSubmissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground" data-testid="empty-contacts">
                No contact submissions found.
              </div>
            ) : (
              <div className="space-y-4">
                {contactSubmissions.map((contact: any, index: number) => (
                  <Card key={contact.id} className="glass-card" data-testid={`card-contact-${index}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg" data-testid={`text-contact-name-${index}`}>
                          {contact.name}
                        </CardTitle>
                        <Badge variant="outline" data-testid={`badge-contact-date-${index}`}>
                          {new Date(contact.submittedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p data-testid={`text-contact-email-${index}`}>
                        <strong>Email:</strong> {contact.email}
                      </p>
                      {contact.service && (
                        <p data-testid={`text-contact-service-${index}`}>
                          <strong>Service:</strong> {contact.service}
                        </p>
                      )}
                      {contact.budget && (
                        <p data-testid={`text-contact-budget-${index}`}>
                          <strong>Budget:</strong> {contact.budget}
                        </p>
                      )}
                      <p data-testid={`text-contact-message-${index}`}>
                        <strong>Message:</strong> {contact.message}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inquiries" className="space-y-6">
            {inquiriesLoading ? (
              <div className="text-center py-8" data-testid="loading-inquiries">Loading inquiries...</div>
            ) : inquirySubmissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground" data-testid="empty-inquiries">
                No inquiry submissions found.
              </div>
            ) : (
              <div className="space-y-4">
                {inquirySubmissions.map((inquiry: any, index: number) => (
                  <Card key={inquiry.id} className="glass-card" data-testid={`card-inquiry-${index}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg" data-testid={`text-inquiry-name-${index}`}>
                          {inquiry.name}
                        </CardTitle>
                        <Badge variant="outline" data-testid={`badge-inquiry-date-${index}`}>
                          {new Date(inquiry.submittedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p data-testid={`text-inquiry-email-${index}`}>
                        <strong>Email:</strong> {inquiry.email}
                      </p>
                      <p data-testid={`text-inquiry-service-${index}`}>
                        <strong>Service:</strong> {inquiry.service}
                      </p>
                      <p data-testid={`text-inquiry-details-${index}`}>
                        <strong>Details:</strong> {inquiry.details}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <div className="text-center py-8 text-muted-foreground">
              Blog management coming soon! Blog posts are currently managed via API.
              <br />
              <span className="text-sm">
                Use POST /api/blog-posts to create new posts programmatically.
              </span>
            </div>
          </TabsContent>
        </Tabs>

        {showServiceForm && (
          <AdminServiceForm
            service={editingService}
            onSuccess={handleServiceFormSuccess}
            onCancel={() => setShowServiceForm(false)}
          />
        )}

        {showCaseStudyForm && (
          <AdminCaseStudyForm
            caseStudy={editingCaseStudy}
            onSuccess={handleCaseStudyFormSuccess}
            onCancel={() => setShowCaseStudyForm(false)}
          />
        )}

        {showProjectForm && (
          <AdminProjectForm
            project={editingProject}
            onSuccess={handleProjectFormSuccess}
            onCancel={() => setShowProjectForm(false)}
          />
        )}
      </div>
    </div>
  );
}
