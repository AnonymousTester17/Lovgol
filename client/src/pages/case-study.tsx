import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Clock, Users, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import type { CaseStudy } from "@shared/schema";

export default function CaseStudy() {
  const [, params] = useRoute("/case-study/:slug");
  const caseStudySlug = params?.slug;
  
  const { data: caseStudy, isLoading, error } = useQuery({
    queryKey: ["/api/case-studies/slug", caseStudySlug],
    queryFn: async () => {
      if (!caseStudySlug) throw new Error("No case study slug provided");
      const response = await fetch(`/api/case-studies/slug/${caseStudySlug}`);
      if (!response.ok) throw new Error("Case study not found");
      return response.json() as Promise<CaseStudy>;
    },
    enabled: !!caseStudySlug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">Loading case study details...</p>
        </div>
      </div>
    );
  }

  if (error || !caseStudy) {
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

  const caseStudyStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": caseStudy.title,
    "description": caseStudy.challenge,
    "image": caseStudy.heroImage,
    "author": {
      "@type": "Organization",
      "name": "LOVGOL"
    },
    "publisher": {
      "@type": "Organization",
      "name": "LOVGOL"
    },
    "about": {
      "@type": "SoftwareApplication",
      "name": caseStudy.title,
      "applicationCategory": caseStudy.industry,
      "operatingSystem": "Web"
    },
    "keywords": caseStudy.technologies ? caseStudy.technologies.join(", ") : ""
  };

  return (
    <div className="min-h-screen bg-background" data-testid="case-study-page">
      <SEOHead
        title={`${caseStudy.title} - Case Study | LOVGOL`}
        description={`Learn how LOVGOL helped ${caseStudy.client} with ${caseStudy.title}. ${caseStudy.challenge ? caseStudy.challenge.substring(0, 120) + '...' : ''}`}
        keywords={`case study, ${caseStudy.industry}, ${caseStudy.technologies ? caseStudy.technologies.join(", ") : ""}, ${caseStudy.client}`}
        image={caseStudy.heroImage}
        url={`https://lovgol.com/case-study/${caseStudy.slug}`}
        type="article"
        structuredData={caseStudyStructuredData}
      />
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
                  {caseStudy.technologies && caseStudy.technologies.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
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
            {caseStudy.images && caseStudy.images.map((image, index) => (
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
              {caseStudy.results && caseStudy.results.map((result, index) => (
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