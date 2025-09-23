import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ['/api/blog-posts', { published: true }],
  });

  const categories = ["all", "Technology", "Mobile Development", "Case Studies"];

  const filteredPosts = selectedCategory === "all" 
    ? (blogPosts as BlogPost[])
    : (blogPosts as BlogPost[]).filter(post => post.category === selectedCategory);

  const formatDate = (date: string | Date | null) => {
    if (!date) return "No date";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="blog-page">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-bg relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 masked-text" data-testid="blog-title">
              Insights & Updates
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto" data-testid="blog-subtitle">
              Stay updated with the latest trends, insights, and stories from the world of web development, mobile apps, and automation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap gap-4 justify-center"
              data-testid="category-filters"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  }`}
                  data-testid={`category-filter-${category.toLowerCase().replace(" ", "-")}`}
                >
                  {category === "all" ? "All Posts" : category}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Blog Posts Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16" data-testid="no-posts">
              <h3 className="text-2xl font-semibold mb-4">No posts found</h3>
              <p className="text-muted-foreground">Try selecting a different category.</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              layout
              data-testid="blog-posts-grid"
            >
              {filteredPosts.map((post: BlogPost, index) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  data-testid={`blog-post-${post.id}`}
                >
                  <Card className="glass-card h-full overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
                    {post.featuredImage && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          data-testid={`blog-post-image-${post.id}`}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>
                    )}
                    
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-primary/20 text-primary" data-testid={`blog-post-category-${post.id}`}>
                          {post.category}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors" data-testid={`blog-post-title-${post.id}`}>
                        {post.title}
                      </h3>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground mb-4 line-clamp-2" data-testid={`blog-post-excerpt-${post.id}`}>
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span data-testid={`blog-post-date-${post.id}`}>
                            {formatDate(post.publishedAt || post.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span data-testid={`blog-post-reading-time-${post.id}`}>
                            {getReadingTime(post.content)}
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        className="inline-flex items-center text-primary hover:text-primary/80 font-medium group/btn"
                        onClick={() => window.location.href = `/blog/${post.slug}`}
                        data-testid={`blog-post-read-more-${post.id}`}
                      >
                        Read More
                        <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}