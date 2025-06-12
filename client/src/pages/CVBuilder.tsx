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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      
      <section className="py-12 lg:py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-primary to-blue-600 p-3 rounded-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              AI-Powered CV Builder
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create a professional resume in minutes. Our AI analyzes your information and formats it according to industry standards.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* CV Builder Form */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl animate-slide-up">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl lg:text-3xl font-semibold text-foreground flex items-center">
                  <UserCircle className="text-primary mr-3 w-8 h-8" />
                  Your Information
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  Fill in your details below. Required fields are marked with an asterisk.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
                      Personal Details
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-foreground font-medium">
                          Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          {...form.register("fullName")}
                          className={`transition-all duration-200 ${
                            form.formState.errors.fullName 
                              ? 'border-destructive focus:ring-destructive' 
                              : 'focus:ring-primary focus:border-primary'
                          }`}
                        />
                        {form.formState.errors.fullName && (
                          <div className="flex items-center text-destructive text-sm mt-1">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {form.formState.errors.fullName.message}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground font-medium">
                          Email Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          {...form.register("email")}
                          className={`transition-all duration-200 ${
                            form.formState.errors.email 
                              ? 'border-destructive focus:ring-destructive' 
                              : 'focus:ring-primary focus:border-primary'
                          }`}
                        />
                        {form.formState.errors.email && (
                          <div className="flex items-center text-destructive text-sm mt-1">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {form.formState.errors.email.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-foreground font-medium">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+94 77 123 4567"
                          {...form.register("phone")}
                          className="focus:ring-primary focus:border-primary transition-all duration-200"
                        />
                        {form.formState.errors.phone && (
                          <div className="flex items-center text-destructive text-sm mt-1">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {form.formState.errors.phone.message}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-foreground font-medium">Location</Label>
                        <Input
                          id="location"
                          placeholder="Colombo, Sri Lanka"
                          {...form.register("location")}
                          className="focus:ring-primary focus:border-primary transition-all duration-200"
                        />
                        {form.formState.errors.location && (
                          <div className="flex items-center text-destructive text-sm mt-1">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {form.formState.errors.location.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
                      Professional Information
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="summary" className="text-foreground font-medium">
                        Professional Summary
                      </Label>
                      <Textarea
                        id="summary"
                        rows={4}
                        placeholder="A brief summary of your experience, skills, and career goals. Keep it between 50-500 characters for best results."
                        {...form.register("summary")}
                        className="resize-none focus:ring-primary focus:border-primary transition-all duration-200"
                      />
                      <div className="flex justify-between items-center">
                        {form.formState.errors.summary ? (
                          <div className="flex items-center text-destructive text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {form.formState.errors.summary.message}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            {form.watch("summary")?.length || 0} characters
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills" className="text-foreground font-medium">
                        Skills <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="skills"
                        placeholder="JavaScript, React, Node.js, Python, Communication, Leadership..."
                        {...form.register("skills")}
                        className={`transition-all duration-200 ${
                          form.formState.errors.skills 
                            ? 'border-destructive focus:ring-destructive' 
                            : 'focus:ring-primary focus:border-primary'
                        }`}
                      />
                      {form.formState.errors.skills ? (
                        <div className="flex items-center text-destructive text-sm mt-1">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {form.formState.errors.skills.message}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Separate skills with commas. Include both technical and soft skills.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-foreground font-medium">
                        Work Experience <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="experience"
                        rows={5}
                        placeholder="Describe your work experience, internships, projects, or relevant activities. Include company names, positions, dates, and key achievements."
                        {...form.register("experience")}
                        className={`resize-none transition-all duration-200 ${
                          form.formState.errors.experience 
                            ? 'border-destructive focus:ring-destructive' 
                            : 'focus:ring-primary focus:border-primary'
                        }`}
                      />
                      {form.formState.errors.experience && (
                        <div className="flex items-center text-destructive text-sm mt-1">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {form.formState.errors.experience.message}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education" className="text-foreground font-medium">
                        Education <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="education"
                        rows={3}
                        placeholder="Your educational background including degrees, certifications, courses, and relevant academic achievements."
                        {...form.register("education")}
                        className={`resize-none transition-all duration-200 ${
                          form.formState.errors.education 
                            ? 'border-destructive focus:ring-destructive' 
                            : 'focus:ring-primary focus:border-primary'
                        }`}
                      />
                      {form.formState.errors.education && (
                        <div className="flex items-center text-destructive text-sm mt-1">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {form.formState.errors.education.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={generateCVMutation.isPending}
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {generateCVMutation.isPending ? (
                        <div className="flex items-center justify-center">
                          <LoadingSpinner size="sm" className="mr-2" />
                          Generating Your Professional CV...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Wand2 className="mr-2 h-5 w-5" />
                          Generate My CV with AI
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* CV Preview */}
            <div className="bg-background border border-border rounded-2xl shadow-xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {generatedCV?.generatedHtml ? (
                <div>
                  <div className="bg-muted/50 p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-foreground">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                        <span className="font-medium">CV Generated Successfully</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="p-8 text-gray-900 max-h-[600px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: generatedCV.generatedHtml }}
                  />
                  
                  <Separator />
                  
                  <div className="bg-muted/30 p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button 
                        onClick={exportToPDF}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center transform hover:scale-105"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                      <Button 
                        variant="outline"
                        className="font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center hover:bg-accent"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Template
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 p-8 rounded-2xl mb-8 border border-border/50">
                    <h2 className="text-3xl font-bold mb-2 text-foreground">Your Name</h2>
                    <p className="text-muted-foreground text-lg mb-4">Your Professional Title</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>📧 your@email.com</span>
                      <span>📱 +94 77 123 4567</span>
                      <span>📍 Your Location</span>
                    </div>
                  </div>
                  
                  <div className="text-center text-muted-foreground py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-lg mb-4 font-medium">Your AI-generated CV will appear here</p>
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
