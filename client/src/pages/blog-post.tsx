import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";
import BlogReactions from "@/components/BlogReactions";
import type { BlogPost } from "@shared/schema";

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['/api/blog-posts/slug', slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog-posts/slug/${slug}`);
      if (!response.ok) {
        throw new Error('Post not found');
      }
      return response.json();
    },
    enabled: !!slug,
  });

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

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Button onClick={() => window.location.href = '/blog'}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const blogPost = post as BlogPost;

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blogPost.title,
    "description": blogPost.excerpt,
    "image": blogPost.featuredImage,
    "datePublished": blogPost.publishedAt || blogPost.createdAt,
    "dateModified": blogPost.updatedAt,
    "author": {
      "@type": "Organization",
      "name": "LOVGOL"
    },
    "publisher": {
      "@type": "Organization",
      "name": "LOVGOL"
    },
    "articleSection": blogPost.category,
    "keywords": blogPost.tags?.join(", ")
  };

  return (
    <div className="min-h-screen bg-background" data-testid="blog-post-page">
      <SEOHead
        title={`${blogPost.title} | LOVGOL Blog`}
        description={blogPost.excerpt}
        keywords={blogPost.tags?.join(", ")}
        image={blogPost.featuredImage || undefined}
        url={`https://lovgol.com/blog/${blogPost.slug}`}
        type="article"
        publishedTime={blogPost.publishedAt || blogPost.createdAt}
        author="LOVGOL"
        structuredData={articleStructuredData}
      />
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Button
          variant="outline"
          onClick={() => window.location.href = '/blog'}
          className="glass-card"
          data-testid="back-to-blog-button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {blogPost.featuredImage && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${blogPost.featuredImage})` }}
            />
            <div className="absolute inset-0 bg-black/60" />
          </>
        )}
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-primary text-primary-foreground" data-testid="post-category">
              {blogPost.category}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight" data-testid="post-title">
              {blogPost.title}
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90" data-testid="post-excerpt">
              {blogPost.excerpt}
            </p>
            
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2" data-testid="post-date">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(blogPost.publishedAt || blogPost.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2" data-testid="post-reading-time">
                <Clock className="h-4 w-4" />
                <span>{getReadingTime(blogPost.content)}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-white hover:text-white/80"
                data-testid="share-button"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
            data-testid="post-content"
          >
            {/* Split content by lines and render each paragraph */}
            {blogPost.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={index} className="text-4xl font-black mb-6 mt-12 first:mt-0">
                    {paragraph.replace('# ', '')}
                  </h1>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-3xl font-bold mb-4 mt-10">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-2xl font-semibold mb-3 mt-8">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                const listItems = paragraph.split('\n').filter(line => line.startsWith('- '));
                return (
                  <ul key={index} className="list-disc pl-6 mb-6 space-y-2">
                    {listItems.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-muted-foreground">
                        {item.replace('- ', '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.trim()) {
                return (
                  <p key={index} className="mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </motion.article>

          {/* Tags */}
          {blogPost.tags && blogPost.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 pt-8 border-t border-border"
              data-testid="post-tags"
            >
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="hover:bg-muted transition-colors"
                    data-testid={`post-tag-${index}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* Blog Reactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <BlogReactions postId={blogPost.id} likeCount={parseInt(blogPost.likeCount) || 0} />
          </motion.div>
        </div>
      </section>
    </div>
  );
}