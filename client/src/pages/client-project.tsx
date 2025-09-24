
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  AlertTriangle, 
  MessageSquare,
  Target,
  TrendingUp,
  Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import SEOHead from "@/components/SEOHead";

export default function ClientProject() {
  const [, params] = useRoute("/client-project/:token");
  const token = params?.token;

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["/api/client-project", token],
    queryFn: async () => {
      if (!token) throw new Error("No project token provided");
      const response = await fetch(`/api/client-project/${token}`);
      if (!response.ok) throw new Error("Project not found");
      return response.json();
    },
    enabled: !!token,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Loading Project Details...</h1>
          <p className="text-muted-foreground">Please wait while we fetch your project information.</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-500">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The project you're looking for doesn't exist or the link has expired.
          </p>
        </div>
      </div>
    );
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'green': return 'text-green-500 bg-green-100';
      case 'yellow': return 'text-yellow-500 bg-yellow-100';
      case 'red': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-100';
      case 'partial': return 'text-yellow-500 bg-yellow-100';
      case 'pending': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <SEOHead
        title={`${project.title} - Project Status | LOVGOL`}
        description={`Track the progress of your project: ${project.title}`}
        noIndex={true}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-black mb-4 masked-text">
            {project.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {project.description}
          </p>
          <div className="flex justify-center items-center gap-4 mt-6">
            <Badge className={`px-4 py-2 ${getHealthColor(project.projectHealth)}`}>
              <Shield className="mr-2 h-4 w-4" />
              Project Health: {project.projectHealth.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Target className="mr-2 h-4 w-4" />
              {project.category} • {project.technology}
            </Badge>
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="text-3xl font-bold text-primary">{project.progressPercentage}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <Progress value={parseInt(project.progressPercentage)} className="mt-4" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="text-3xl font-bold">{project.estimatedDeliveryDays}</p>
                    <p className="text-sm text-muted-foreground">days</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Status</p>
                    <p className="text-xl font-bold capitalize">{project.deliveryStatus}</p>
                  </div>
                  {project.deliveryStatus === 'completed' ? (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  ) : (
                    <Clock className="h-8 w-8 text-yellow-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <Badge className={`${getPaymentStatusColor(project.paymentStatus)} mt-2`}>
                      {project.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>
                  <CreditCard className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Current Progress Description */}
        {project.progressDescription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Latest Development Update
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {project.progressDescription}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Milestones */}
        {project.milestones && project.milestones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-12"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Project Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.milestones.map((milestone: any, index: number) => (
                    <div key={milestone.id} className="flex items-start gap-4">
                      <div className={`mt-1 rounded-full p-1 ${
                        milestone.status === 'completed' ? 'bg-green-500' :
                        milestone.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-300'
                      }`}>
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{milestone.title}</h4>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        <Badge variant="outline" className="mt-2">
                          {milestone.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Client Feedback */}
        {project.clientFeedback && project.clientFeedback.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mb-12"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Feedback & Communication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.clientFeedback.slice(-3).map((feedback: any, index: number) => (
                    <div key={feedback.id} className="p-4 bg-card rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={
                          feedback.type === 'approval' ? 'default' :
                          feedback.type === 'concern' ? 'destructive' :
                          feedback.type === 'request' ? 'secondary' : 'outline'
                        }>
                          {feedback.type.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(feedback.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{feedback.feedback}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center py-8"
        >
          <p className="text-muted-foreground mb-4">
            Last updated: {new Date(project.updatedAt).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            This page automatically refreshes every 30 seconds to show the latest project status.
          </p>
          <div className="mt-6 p-4 bg-card rounded-lg border">
            <p className="text-sm text-muted-foreground">
              Questions about your project? Contact us at{" "}
              <a href="mailto:contact@lovgol.com" className="text-primary hover:underline">
                contact@lovgol.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
