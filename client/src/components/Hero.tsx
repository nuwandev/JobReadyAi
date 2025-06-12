import { Link } from "wouter";
import { FileText, Mic, Compass, ArrowRight, Star, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  const features = [
    {
      icon: FileText,
      title: "AI CV Builder",
      description: "Create professional resumes instantly. Just enter your details and let AI format and optimize your CV with industry best practices.",
      buttonText: "Build My CV",
      href: "/cv-builder",
      gradient: "from-primary to-blue-600",
      stats: "10k+ CVs created",
    },
    {
      icon: Mic,
      title: "Interview Trainer",
      description: "Practice with realistic interview questions tailored to your target job. Get instant feedback and improve your confidence.",
      buttonText: "Start Training",
      href: "/interview-trainer",
      gradient: "from-secondary to-purple-600",
      stats: "5k+ interviews practiced",
    },
    {
      icon: Compass,
      title: "Career Guide",
      description: "Get personalized career advice, discover suitable jobs, and receive guidance on remote opportunities and skill development.",
      buttonText: "Get Guidance",
      href: "/career-guide",
      gradient: "from-emerald-500 to-green-600",
      stats: "15k+ questions answered",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:to-secondary/10"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-secondary/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
          <div className="text-center max-w-5xl mx-auto">
            <div className="animate-fade-in">
              <div className="flex justify-center mb-6">
                <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-primary/30 bg-primary/10 text-primary">
                  <Star className="w-4 h-4 mr-2" />
                  Award-Winning Career Platform
                </Badge>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent leading-tight">
                Your AI-Powered Career Journey Starts Here
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                Built for students and job seekers in Sri Lanka and developing countries. 
                Get personalized CV generation, interview practice, and career guidance powered by advanced AI.
              </p>

              <div className="flex flex-wrap justify-center items-center gap-6 mb-12 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  <span>50,000+ Users</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-secondary" />
                  <span>95% Success Rate</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-emerald-500" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-16 animate-slide-up">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index} 
                    className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl lg:rounded-3xl p-6 lg:p-8 hover:bg-card/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative">
                      <div className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300 group-hover:rotate-3`}>
                        <Icon className="text-white text-xl lg:text-2xl" />
                      </div>
                      <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs px-2 py-1">
                        {feature.stats}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl lg:text-2xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed text-sm lg:text-base">
                      {feature.description}
                    </p>
                    
                    <Link href={feature.href}>
                      <Button className={`w-full bg-gradient-to-r ${feature.gradient} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 group-hover:shadow-lg group/button`}>
                        <span className="flex items-center justify-center">
                          {feature.buttonText}
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/button:translate-x-1" />
                        </span>
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Call to action section */}
            <div className="mt-16 lg:mt-24 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 lg:p-12 border border-border/50">
                <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-foreground">
                  Ready to Transform Your Career?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Join thousands of successful job seekers who've landed their dream jobs with JobReady AI.
                </p>
                <Link href="/cv-builder">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
