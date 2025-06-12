import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { Link } from "wouter";
import { Twitter, Linkedin, Github, Globe, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-dark text-slate-50">
      <Header />
      <Hero />
      
      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <i className="fas fa-brain text-white text-lg"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">JobReady AI</h3>
                  <p className="text-xs text-muted">Career Assistant</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6">
                Empowering students and job seekers in Sri Lanka and developing countries with AI-powered career tools. 
                Build professional CVs, practice interviews, and get personalized career guidance.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="/cv-builder" className="hover:text-white transition-colors">AI CV Builder</Link></li>
                <li><Link href="/interview-trainer" className="hover:text-white transition-colors">Interview Trainer</Link></li>
                <li><Link href="/career-guide" className="hover:text-white transition-colors">Career Guide</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Job Finder</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm">
                © 2024 JobReady AI. Made with ❤️ for the next generation of professionals.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm text-slate-400">
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
