import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Users, 
  Zap, 
  Target,
  Star,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="relative z-20 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary to-blue-600 p-2 rounded-xl">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                JobReady AI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-medium px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Sign In with Google
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Career Platform
            </Badge>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Launch Your <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Dream Career</span> with AI
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
              Empower your career journey with our comprehensive AI-driven platform. 
              Build professional CVs, master interviews, and get personalized career guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl text-lg"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-sm text-muted-foreground">
                No credit card required • Sign in with Google
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl group animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">AI CV Builder</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Create professional, ATS-friendly CVs with our AI-powered builder. 
                  Get personalized suggestions and industry-specific formatting.
                </p>
                <ul className="text-left space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Professional templates
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    ATS optimization
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    AI-powered content suggestions
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl group animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Interview Trainer</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Practice with AI-generated interview questions tailored to your target role. 
                  Get detailed feedback and scoring to improve your performance.
                </p>
                <ul className="text-left space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Role-specific questions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    AI feedback & scoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Performance analytics
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl group animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Career Guide</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Get personalized career advice from our AI assistant. 
                  Explore opportunities, plan your path, and make informed decisions.
                </p>
                <ul className="text-left space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Personalized advice
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Market insights
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Skill development plans
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">CVs Generated</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="text-4xl lg:text-5xl font-bold text-emerald-500 mb-2">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-4xl lg:text-5xl font-bold text-purple-500 mb-2">24/7</div>
              <div className="text-muted-foreground">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
            Ready to Transform Your Career?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Join thousands of professionals who have accelerated their careers with JobReady AI.
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl text-lg"
          >
            Start Your Journey Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 JobReady AI. Empowering careers with artificial intelligence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}