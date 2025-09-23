import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit, Plus } from "lucide-react";
import AdminServiceForm from "@/components/AdminServiceForm";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ServicePreview } from "@shared/schema";

export default function Admin() {
  const [editingService, setEditingService] = useState<ServicePreview | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: servicePreviews = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/service-previews"],
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

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service preview?")) {
      deleteServiceMutation.mutate(id);
    }
  };

  const handleEdit = (service: ServicePreview) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingService(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8" data-testid="admin-page">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold masked-text" data-testid="text-admin-title">LOVGOL Admin Panel</h1>
          <Button 
            onClick={handleAdd} 
            className="bg-primary hover:bg-primary/80"
            data-testid="button-add-service"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="services" data-testid="tab-services">Services ({servicePreviews.length})</TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts">Contact Submissions ({contactSubmissions.length})</TabsTrigger>
            <TabsTrigger value="inquiries" data-testid="tab-inquiries">Inquiries ({inquirySubmissions.length})</TabsTrigger>
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
                            onClick={() => handleEdit(service)}
                            data-testid={`button-edit-${service.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(service.id)}
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
        </Tabs>

        {showForm && (
          <AdminServiceForm
            service={editingService}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
}
