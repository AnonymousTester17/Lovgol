
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, ThumbsUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { BlogReaction } from "@shared/schema";

interface BlogReactionsProps {
  postId: string;
  likeCount: number;
}

export default function BlogReactions({ postId, likeCount }: BlogReactionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [comment, setComment] = useState("");

  const { data: reactions = [], isLoading } = useQuery({
    queryKey: ['/api/blog-reactions', { postId }],
    queryFn: () => apiRequest("GET", `/api/blog-reactions?postId=${postId}`)
  });

  const reactionMutation = useMutation({
    mutationFn: async (reactionData: {
      postId: string;
      reactionType: string;
      userName?: string;
      userEmail?: string;
      comment?: string;
    }) => {
      return await apiRequest("POST", "/api/blog-reactions", reactionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-reactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      toast({
        title: "Reaction added",
        description: "Thank you for your feedback!",
      });
      setShowCommentForm(false);
      setUserName("");
      setUserEmail("");
      setComment("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add reaction.",
        variant: "destructive",
      });
    },
  });

  const handleReaction = (reactionType: string) => {
    reactionMutation.mutate({
      postId,
      reactionType,
    });
  };

  const handleComment = () => {
    if (!userName.trim() || !userEmail.trim() || !comment.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    reactionMutation.mutate({
      postId,
      reactionType: "comment",
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      comment: comment.trim(),
    });
  };

  const getReactionIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4" />;
      case "love":
        return <Star className="h-4 w-4" />;
      case "insightful":
        return <ThumbsUp className="h-4 w-4" />;
      case "helpful":
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  const comments = reactions.filter((r: BlogReaction) => r.comment && r.comment.trim());

  return (
    <div className="mt-12 pt-8 border-t border-border" data-testid="blog-reactions">
      {/* Reaction Buttons */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">What did you think of this post?</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => handleReaction("like")}
            className="hover:bg-red-500/20 hover:border-red-500 hover:text-red-500 transition-colors"
            data-testid="like-button"
          >
            <Heart className="mr-2 h-4 w-4" />
            Like ({likeCount})
          </Button>
          <Button
            variant="outline"
            onClick={() => handleReaction("love")}
            className="hover:bg-yellow-500/20 hover:border-yellow-500 hover:text-yellow-500 transition-colors"
            data-testid="love-button"
          >
            <Star className="mr-2 h-4 w-4" />
            Love it
          </Button>
          <Button
            variant="outline"
            onClick={() => handleReaction("insightful")}
            className="hover:bg-blue-500/20 hover:border-blue-500 hover:text-blue-500 transition-colors"
            data-testid="insightful-button"
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            Insightful
          </Button>
          <Button
            variant="outline"
            onClick={() => handleReaction("helpful")}
            className="hover:bg-green-500/20 hover:border-green-500 hover:text-green-500 transition-colors"
            data-testid="helpful-button"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Helpful
          </Button>
        </div>
      </div>

      {/* Comment Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
          <Button
            onClick={() => setShowCommentForm(!showCommentForm)}
            variant={showCommentForm ? "outline" : "default"}
            data-testid="toggle-comment-form"
          >
            {showCommentForm ? "Cancel" : "Add Comment"}
          </Button>
        </div>

        {showCommentForm && (
          <Card className="mb-6 glass-card" data-testid="comment-form">
            <CardHeader>
              <CardTitle className="text-lg">Leave a Comment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userName">Name</Label>
                    <Input
                      id="userName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Your name"
                      className="bg-input border-border"
                      data-testid="comment-name-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="Your email (won't be published)"
                      className="bg-input border-border"
                      data-testid="comment-email-input"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={4}
                    className="bg-input border-border"
                    data-testid="comment-text-input"
                  />
                </div>
                <Button
                  onClick={handleComment}
                  disabled={reactionMutation.isPending}
                  data-testid="submit-comment-button"
                >
                  {reactionMutation.isPending ? "Submitting..." : "Submit Comment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Display Comments */}
        {comments.length > 0 ? (
          <div className="space-y-4" data-testid="comments-list">
            {comments.map((reaction: BlogReaction) => (
              <Card key={reaction.id} className="glass-card" data-testid={`comment-${reaction.id}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{reaction.userName || "Anonymous"}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reaction.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">{reaction.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>

      {/* Reaction Statistics */}
      {reactions.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <h4 className="text-md font-medium mb-3">Reader Reactions</h4>
          <div className="flex flex-wrap gap-2">
            {['like', 'love', 'insightful', 'helpful'].map((type) => {
              const count = reactions.filter((r: BlogReaction) => r.reactionType === type).length;
              if (count === 0) return null;
              
              return (
                <Badge key={type} variant="secondary" className="flex items-center gap-1">
                  {getReactionIcon(type)}
                  <span className="capitalize">{type}</span>
                  <span>({count})</span>
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
