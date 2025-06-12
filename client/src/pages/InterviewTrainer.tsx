import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Briefcase, Mic, Trophy, CheckCircle, ArrowRight, RotateCcw } from "lucide-react";
import type { InterviewSession } from "@shared/schema";

const jobTypes = [
  { title: "Web Developer", icon: "💻", description: "Frontend, Backend, Full-stack" },
  { title: "UI/UX Designer", icon: "🎨", description: "Design, User Experience" },
  { title: "Digital Marketing", icon: "📈", description: "Social Media, SEO, Content" },
  { title: "Data Analyst", icon: "📊", description: "Analytics, Insights, Reports" },
  { title: "Customer Support", icon: "🎧", description: "Help Desk, Client Relations" },
  { title: "Content Writer", icon: "✍️", description: "Articles, Copywriting, Blogs" },
];

export default function InterviewTrainer() {
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [customJob, setCustomJob] = useState<string>("");
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const { toast } = useToast();

  const startInterviewMutation = useMutation({
    mutationFn: async (jobTitle: string) => {
      const response = await apiRequest("POST", "/api/interview/start", {
        jobTitle,
        userId: 1, // Mock user ID
      });
      return await response.json();
    },
    onSuccess: (session: InterviewSession) => {
      setCurrentSession(session);
      setCurrentQuestionIndex(0);
      setCurrentAnswer("");
      toast({
        title: "Interview Started!",
        description: `Generated ${session.questions?.length || 0} questions for ${session.jobTitle}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Start Interview",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async ({ sessionId, questionIndex, answer }: { sessionId: number, questionIndex: number, answer: string }) => {
      const response = await apiRequest("POST", `/api/interview/${sessionId}/answer`, {
        questionIndex,
        answer,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setCurrentSession(data.session);
      setCurrentAnswer("");
      
      toast({
        title: "Answer Submitted!",
        description: `Score: ${data.feedback.score}/10`,
      });

      // Move to next question or show results
      if (currentQuestionIndex < (data.session.questions?.length || 0) - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Submit Answer",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStartInterview = () => {
    const jobTitle = customJob.trim() || selectedJob;
    if (!jobTitle) {
      toast({
        title: "Job Title Required",
        description: "Please select a job type or enter a custom job title.",
        variant: "destructive",
      });
      return;
    }
    startInterviewMutation.mutate(jobTitle);
  };

  const handleSubmitAnswer = () => {
    if (!currentSession || !currentAnswer.trim()) {
      toast({
        title: "Answer Required",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    submitAnswerMutation.mutate({
      sessionId: currentSession.id,
      questionIndex: currentQuestionIndex,
      answer: currentAnswer.trim(),
    });
  };

  const handleRetakeInterview = () => {
    setCurrentSession(null);
    setCurrentQuestionIndex(0);
    setCurrentAnswer("");
    setSelectedJob("");
    setCustomJob("");
  };

  const currentQuestion = currentSession?.questions?.[currentQuestionIndex];
  const progress = currentSession?.questions ? ((currentQuestionIndex + 1) / currentSession.questions.length) * 100 : 0;
  const isCompleted = currentSession?.completed;

  return (
    <div className="min-h-screen bg-dark text-slate-50">
      <Header />
      
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">AI Interview Trainer</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Practice with realistic interview questions and get instant feedback to boost your confidence.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {!currentSession ? (
              // Job Selection
              <Card className="bg-surface/70 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-white flex items-center">
                    <Briefcase className="text-secondary mr-3" />
                    Select Your Target Job
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {jobTypes.map((job) => (
                      <button
                        key={job.title}
                        onClick={() => setSelectedJob(job.title)}
                        className={`p-4 border-2 rounded-xl hover:border-secondary hover:bg-secondary/10 transition-all text-left group ${
                          selectedJob === job.title ? 'border-secondary bg-secondary/10' : 'border-slate-600'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-3">{job.icon}</span>
                          <h4 className="font-semibold text-white">{job.title}</h4>
                        </div>
                        <p className="text-sm text-slate-400">{job.description}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      placeholder="Or enter a custom job title..."
                      value={customJob}
                      onChange={(e) => setCustomJob(e.target.value)}
                      className="flex-1 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-secondary focus:border-secondary"
                    />
                    <Button
                      onClick={handleStartInterview}
                      disabled={startInterviewMutation.isPending}
                      className="bg-secondary hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors whitespace-nowrap"
                    >
                      {startInterviewMutation.isPending ? "Starting..." : "Start Interview"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : isCompleted ? (
              // Interview Results
              <Card className="bg-surface/70 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-white flex items-center">
                    <Trophy className="text-amber-500 mr-3" />
                    Interview Complete!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-white">{currentSession.overallScore}%</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">Overall Performance</h3>
                    <p className="text-slate-400">
                      {currentSession.overallScore! >= 80 ? "Excellent work!" : 
                       currentSession.overallScore! >= 60 ? "Good job!" : 
                       "Keep practicing!"}
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <h4 className="font-semibold text-white mb-4">Question Review</h4>
                    {currentSession.questions?.map((q, index) => (
                      <div key={index} className="bg-slate-800/50 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-white">Question {index + 1}</h5>
                          <Badge variant={q.score! >= 7 ? "default" : q.score! >= 5 ? "secondary" : "destructive"}>
                            {q.score}/10
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-sm mb-2">{q.question}</p>
                        {q.feedback && (
                          <p className="text-slate-400 text-sm">{q.feedback}</p>
                        )}
                      </div>
                    )) || []}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleRetakeInterview}
                      className="flex-1 bg-secondary hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Retake Interview
                    </Button>
                    <Button
                      onClick={handleRetakeInterview}
                      variant="outline"
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                      Try Different Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Interview Session
              <Card className="bg-surface/70 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl font-semibold text-white flex items-center">
                      <Mic className="text-secondary mr-3" />
                      Interview Session
                    </CardTitle>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Question</div>
                      <div className="text-2xl font-bold text-white">
                        {currentQuestionIndex + 1} / {currentSession.questions?.length || 0}
                      </div>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </CardHeader>
                <CardContent>
                  {currentQuestion && (
                    <>
                      {/* Current Question */}
                      <div className="bg-slate-800/50 rounded-2xl p-6 mb-8">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-secondary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">AI</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-2">AI Interviewer</h4>
                            <p className="text-slate-300 leading-relaxed">
                              {currentQuestion.question}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Answer Input */}
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-300">Your Answer</label>
                        <Textarea
                          rows={6}
                          placeholder="Type your answer here..."
                          value={currentAnswer}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                          className="w-full bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-secondary focus:border-secondary resize-none"
                        />
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button
                            variant="outline"
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
                          >
                            <Mic className="mr-2 h-4 w-4" />
                            Record Answer
                          </Button>
                          <Button
                            onClick={handleSubmitAnswer}
                            disabled={submitAnswerMutation.isPending || !currentAnswer.trim()}
                            className="flex-1 bg-secondary hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
                          >
                            {submitAnswerMutation.isPending ? "Evaluating..." : (
                              <>
                                <ArrowRight className="mr-2 h-4 w-4" />
                                {currentQuestionIndex < (currentSession.questions?.length || 0) - 1 ? "Next Question" : "Finish Interview"}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Previous Answer Feedback */}
                      {currentQuestionIndex > 0 && currentSession.questions?.[currentQuestionIndex - 1]?.feedback && (
                        <div className="mt-8 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
                          <div className="flex items-start space-x-4">
                            <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="font-semibold text-emerald-400 mb-2">Previous Answer Feedback</h4>
                              <p className="text-emerald-300 leading-relaxed">
                                {currentSession.questions[currentQuestionIndex - 1].feedback}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
