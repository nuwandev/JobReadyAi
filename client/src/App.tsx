import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "@/pages/Home";
import CVBuilder from "@/pages/CVBuilder";
import InterviewTrainer from "@/pages/InterviewTrainer";
import CareerGuide from "@/pages/CareerGuide";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cv-builder" component={CVBuilder} />
      <Route path="/interview-trainer" component={InterviewTrainer} />
      <Route path="/career-guide" component={CareerGuide} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="jobready-ui-theme">
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </QueryClientProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
