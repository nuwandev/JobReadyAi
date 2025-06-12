import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { UserCircle, Wand2, Download, Edit, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import type { CV } from "@shared/schema";

const cvFormSchema = z.object({
  fullName: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name should only contain letters and spaces"),
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email is too short")
    .max(100, "Email is too long"),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^[\+]?[0-9\s\-\(\)]{7,15}$/.test(val), {
      message: "Please enter a valid phone number"
    }),
  location: z.string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Location must be at least 2 characters"
    }),
  summary: z.string()
    .optional()
    .refine((val) => !val || (val.length >= 50 && val.length <= 500), {
      message: "Summary should be between 50-500 characters for best results"
    }),
  skills: z.string()
    .min(1, "Please add at least one skill")
    .refine((val) => val.split(',').filter(s => s.trim()).length >= 3, {
      message: "Please add at least 3 skills separated by commas"
    }),
  experience: z.string()
    .min(20, "Please provide more details about your experience (at least 20 characters)")
    .max(2000, "Experience description is too long"),
  education: z.string()
    .min(10, "Please provide your educational background (at least 10 characters)")
    .max(1000, "Education description is too long"),
  userId: z.number().optional(),
});

type CVFormData = z.infer<typeof cvFormSchema>;

export default function CVBuilder() {
  const [generatedCV, setGeneratedCV] = useState<CV | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CVFormData>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      skills: "",
      experience: "",
      education: "",
      userId: 1, // Mock user ID for demo
    },
  });

  const generateCVMutation = useMutation({
    mutationFn: async (data: CVFormData) => {
      const skillsArray = data.skills ? data.skills.split(',').map(s => s.trim()) : [];
      const response = await apiRequest("POST", "/api/cv/generate", {
        ...data,
        skills: skillsArray,
      });
      return await response.json();
    },
    onSuccess: (cv: CV) => {
      setGeneratedCV(cv);
      toast({
        title: "CV Generated Successfully!",
        description: "Your professional CV has been created with AI assistance.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cv"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate CV. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CVFormData) => {
    generateCVMutation.mutate(data);
  };

  const exportToPDF = () => {
    if (!generatedCV?.generatedHtml) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>CV - ${generatedCV.fullName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${generatedCV.generatedHtml}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-dark text-slate-50">
      <Header />
      
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">AI-Powered CV Builder</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Create a professional resume in minutes. Our AI analyzes your information and formats it according to industry standards.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* CV Builder Form */}
            <Card className="bg-surface/70 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white flex items-center">
                  <UserCircle className="text-primary mr-3" />
                  Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        {...form.register("fullName")}
                        className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary"
                      />
                      {form.formState.errors.fullName && (
                        <p className="text-red-400 text-sm mt-1">{form.formState.errors.fullName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-slate-300">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...form.register("email")}
                        className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary"
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-400 text-sm mt-1">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+94 77 123 4567"
                        {...form.register("phone")}
                        className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-slate-300">Location</Label>
                      <Input
                        id="location"
                        placeholder="Colombo, Sri Lanka"
                        {...form.register("location")}
                        className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="summary" className="text-slate-300">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      rows={4}
                      placeholder="Brief summary of your experience and goals..."
                      {...form.register("summary")}
                      className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary resize-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="skills" className="text-slate-300">Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      placeholder="JavaScript, React, Node.js, Python..."
                      {...form.register("skills")}
                      className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <Label htmlFor="experience" className="text-slate-300">Experience</Label>
                    <Textarea
                      id="experience"
                      rows={4}
                      placeholder="List your work experience, projects, or relevant activities..."
                      {...form.register("experience")}
                      className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary resize-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="education" className="text-slate-300">Education</Label>
                    <Textarea
                      id="education"
                      rows={3}
                      placeholder="Your educational background..."
                      {...form.register("education")}
                      className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={generateCVMutation.isPending}
                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300"
                  >
                    {generateCVMutation.isPending ? (
                      <>Generating...</>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        Generate My CV with AI
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* CV Preview */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {generatedCV?.generatedHtml ? (
                <div>
                  <div 
                    className="p-8"
                    dangerouslySetInnerHTML={{ __html: generatedCV.generatedHtml }}
                  />
                  <Separator />
                  <div className="bg-slate-50 p-6">
                    <div className="flex gap-4">
                      <Button 
                        onClick={exportToPDF}
                        className="flex-1 bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Template
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-gray-800">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white mb-8 rounded-lg">
                    <h2 className="text-3xl font-bold mb-2">Your Name</h2>
                    <p className="text-slate-300 text-lg mb-4">Your Job Title</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span>📧 your@email.com</span>
                      <span>📱 +94 77 123 4567</span>
                      <span>📍 Your Location</span>
                    </div>
                  </div>
                  
                  <div className="text-center text-gray-500 py-12">
                    <p className="text-lg mb-4">Your generated CV will appear here</p>
                    <p className="text-sm">Fill out the form and click "Generate My CV with AI" to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
