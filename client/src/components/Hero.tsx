import { Link } from "wouter";
import { FileText, Mic, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const features = [
    {
      icon: FileText,
      title: "AI CV Builder",
      description: "Create professional resumes instantly. Just enter your details and let AI format and optimize your CV with industry best practices.",
      buttonText: "Build My CV",
      href: "/cv-builder",
      gradient: "from-primary to-blue-600",
    },
    {
      icon: Mic,
      title: "Interview Trainer",
      description: "Practice with realistic interview questions tailored to your target job. Get instant feedback and improve your confidence.",
      buttonText: "Start Training",
      href: "/interview-trainer",
      gradient: "from-secondary to-purple-600",
    },
    {
      icon: Compass,
      title: "Career Guide",
      description: "Get personalized career advice, discover suitable jobs, and receive guidance on remote opportunities and skill development.",
      buttonText: "Get Guidance",
      href: "/career-guide",
      gradient: "from-emerald-500 to-green-600",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
                Your AI-Powered Career Journey Starts Here
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Built for students and job seekers in Sri Lanka and developing countries. 
                Get personalized CV generation, interview practice, and career guidance powered by advanced AI.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-16 animate-slide-up">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="bg-surface/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:bg-surface/70 transition-all duration-300 hover:scale-105 group">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-primary/25 transition-all`}>
                      <Icon className="text-white text-2xl" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-white">{feature.title}</h3>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <Link href={feature.href}>
                      <Button className={`w-full bg-gradient-to-r ${feature.gradient} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-xl transition-all`}>
                        {feature.buttonText}
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
