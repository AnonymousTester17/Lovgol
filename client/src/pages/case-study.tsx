import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Clock, Users, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface CaseStudyData {
  id: string;
  title: string;
  client: string;
  industry: string;
  timeline: string;
  teamSize: string;
  technologies: string[];
  challenge: string;
  solution: string;
  results: string[];
  heroImage: string;
  images: string[];
  liveUrl?: string;
}

const caseStudies: Record<string, CaseStudyData> = {
  "ecommerce-platform": {
    id: "ecommerce-platform",
    title: "Next-Generation E-commerce Platform",
    client: "TechCorp",
    industry: "E-commerce",
    timeline: "6 months",
    teamSize: "5 developers",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
    challenge: "TechCorp needed a scalable e-commerce platform that could handle high traffic volumes while providing a seamless user experience across all devices. Their existing platform was outdated and couldn't support their growing business needs.",
    solution: "We designed and built a modern, responsive e-commerce platform using React and Node.js, with a microservices architecture for scalability. The platform features real-time inventory management, secure payment processing, and advanced analytics.",
    results: [
      "300% increase in conversion rates",
      "50% reduction in page load times", 
      "99.9% uptime achievement",
      "200% increase in mobile transactions"
    ],
    heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    liveUrl: "https://techcorp-demo.lovgol.com"
  },
  "mobile-fitness-app": {
    id: "mobile-fitness-app",
    title: "AI-Powered Fitness Tracking App",
    client: "FitLife",
    industry: "Health & Fitness",
    timeline: "8 months",
    teamSize: "4 developers",
    technologies: ["React Native", "Python", "TensorFlow", "Firebase"],
    challenge: "FitLife wanted to create a comprehensive fitness app that could provide personalized workout recommendations using AI, track user progress, and integrate with various wearable devices.",
    solution: "We developed a cross-platform mobile app using React Native with an AI recommendation engine built in Python. The app features real-time workout tracking, social features, and seamless integration with popular fitness wearables.",
    results: [
      "500K+ downloads in first 6 months",
      "4.8 star rating on app stores",
      "85% user retention rate",
      "Featured as 'App of the Day'"
    ],
    heroImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    images: [
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1434596922112-19c563067271?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ]
  },
  "automation-pipeline": {
    id: "automation-pipeline", 
    title: "Enterprise Data Processing Pipeline",
    client: "DataCorp",
    industry: "Data Analytics",
    timeline: "4 months",
    teamSize: "3 developers",
    technologies: ["Python", "Apache Kafka", "Docker", "Kubernetes", "PostgreSQL"],
    challenge: "DataCorp needed to automate their manual data processing workflows that were taking hours to complete and prone to human error. They required a scalable solution that could handle growing data volumes.",
    solution: "We built a fully automated data pipeline using Python and Apache Kafka, containerized with Docker and orchestrated using Kubernetes. The system processes millions of records daily with built-in error handling and monitoring.",
    results: [
      "95% reduction in processing time",
      "99.9% accuracy in data processing",
      "Zero manual intervention required",
      "$500K annual cost savings"
    ],
    heroImage: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ]
  }
};

export default function CaseStudy() {
  const [, params] = useRoute("/case-study/:id");
  const caseStudyId = params?.id;
  
  const caseStudy = caseStudyId ? caseStudies[caseStudyId] : null;

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Case Study Not Found</h1>
          <p className="text-muted-foreground mb-8">The case study you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="case-study-page">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="glass-card"
          data-testid="back-button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${caseStudy.heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-primary text-primary-foreground" data-testid="case-study-industry">
              {caseStudy.industry}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight" data-testid="case-study-title">
              {caseStudy.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90" data-testid="case-study-client">
              For {caseStudy.client}
            </p>
            
            {caseStudy.liveUrl && (
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/80"
                onClick={() => window.open(caseStudy.liveUrl, '_blank')}
                data-testid="view-live-button"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                View Live Site
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <Card className="glass-card">
              <CardContent className="p-6 text-center" data-testid="project-timeline">
                <Clock className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Timeline</h3>
                <p className="text-muted-foreground">{caseStudy.timeline}</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6 text-center" data-testid="project-team">
                <Users className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Team Size</h3>
                <p className="text-muted-foreground">{caseStudy.teamSize}</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6 text-center" data-testid="project-tech">
                <Code className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-1 justify-center">
                  {caseStudy.technologies.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {caseStudy.technologies.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{caseStudy.technologies.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Challenge & Solution */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-16"
          >
            <div data-testid="challenge-section">
              <h2 className="text-4xl font-bold mb-6 masked-text">The Challenge</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {caseStudy.challenge}
              </p>
            </div>
            
            <div data-testid="solution-section">
              <h2 className="text-4xl font-bold mb-6 masked-text">Our Solution</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {caseStudy.solution}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Images */}
      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            data-testid="project-images"
          >
            {caseStudy.images.map((image, index) => (
              <motion.img
                key={index}
                src={image}
                alt={`Project screenshot ${index + 1}`}
                className="rounded-lg shadow-lg w-full h-64 object-cover"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                data-testid={`project-image-${index}`}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-12 text-center masked-text">Results That Matter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-testid="results-section">
              {caseStudy.results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 rounded-lg"
                  data-testid={`result-${index}`}
                >
                  <div className="text-3xl font-bold text-primary mb-2">✓</div>
                  <p className="text-lg font-medium">{result}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}