import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { Link } from "wouter";
import { Twitter, Linkedin, Github, Globe, Shield, Brain } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      <Hero />
      
      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6 animate-fade-in">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">JobReady AI</h3>
                  <p className="text-xs text-muted-foreground">Career Assistant</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                Empowering students and job seekers in Sri Lanka and developing countries with AI-powered career tools. 
                Build professional CVs, practice interviews, and get personalized career guidance.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-muted hover:bg-accent rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-300 transform hover:scale-110">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-muted hover:bg-accent rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-300 transform hover:scale-110">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-muted hover:bg-accent rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-300 transform hover:scale-110">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h4 className="font-semibold text-foreground mb-4">Features</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link href="/cv-builder" className="hover:text-primary transition-colors duration-200 hover:underline">AI CV Builder</Link></li>
                <li><Link href="/interview-trainer" className="hover:text-primary transition-colors duration-200 hover:underline">Interview Trainer</Link></li>
                <li><Link href="/career-guide" className="hover:text-primary transition-colors duration-200 hover:underline">Career Guide</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200 hover:underline">Job Finder</a></li>
              </ul>
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors duration-200 hover:underline">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200 hover:underline">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200 hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200 hover:underline">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-muted-foreground text-sm text-center md:text-left">
                © 2024 JobReady AI. Made with ❤️ for the next generation of professionals.
              </p>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  English | සිංහල
                </span>
                <span className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Secure & Private
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
