import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import Login from "@/pages/login";
import CaseStudy from "@/pages/case-study";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import ClientProject from "@/pages/client-project";
import { apiRequest } from "./lib/queryClient";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { data, isLoading } = useQuery<{ isAuthenticated: boolean }>({
    queryKey: ["/api/auth/status"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      component={(props: any) =>
        data?.isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <ProtectedRoute path="/admin" component={Admin} />
      <Route path="/case-study/:slug" component={CaseStudy} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/client-project/:token" component={ClientProject} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;