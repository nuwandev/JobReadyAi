import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Bot, User, Send, Shield, Search, GraduationCap } from "lucide-react";
import type { ChatSession } from "@shared/schema";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const quickActions = [
  "What remote jobs can I do as a beginner?",
  "How do I improve my skills?",
  "Show me job market trends",
  "What job suits someone who loves design?",
  "How to prepare for my first interview?",
  "Best online courses for programming?",
];

export default function CareerGuide() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Career Guide. I'm here to help you with career advice, job recommendations, and skill development guidance. What would you like to know?",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startChatMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/chat/start", {
        userId: 1, // Mock user ID
      });
      return await response.json();
    },
    onSuccess: (session: ChatSession) => {
      setCurrentSessionId(session.id);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ sessionId, message }: { sessionId: number, message: string }) => {
      const response = await apiRequest("POST", `/api/chat/${sessionId}/message`, {
        message,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setMessages(data.session.messages || []);
      setIsTyping(false);
    },
    onError: (error: Error) => {
      setIsTyping(false);
      toast({
        title: "Failed to Send Message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);

    // Start session if not exists
    if (!currentSessionId) {
      try {
        const session = await startChatMutation.mutateAsync();
        setCurrentSessionId(session.id);
        sendMessageMutation.mutate({ sessionId: session.id, message });
      } catch (error) {
        setIsTyping(false);
        toast({
          title: "Failed to Start Chat",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } else {
      sendMessageMutation.mutate({ sessionId: currentSessionId, message });
    }
  };

  const handleQuickAction = (message: string) => {
    handleSendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(currentMessage);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-slate-50">
      <Header />
      
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">AI Career Guide</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Get personalized career advice, discover job opportunities, and receive guidance tailored to your goals.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Chat Interface */}
            <Card className="bg-surface/70 backdrop-blur-sm border-slate-700 overflow-hidden">
              {/* Chat Header */}
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="text-white text-xl" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-white">Career AI Assistant</CardTitle>
                    <p className="text-emerald-100">Ready to help with your career journey</p>
                  </div>
                </div>
              </CardHeader>

              {/* Chat Messages */}
              <CardContent className="p-0">
                <ScrollArea className="h-96 p-6">
                  <div className="space-y-6">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex items-start space-x-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                        {message.role === 'assistant' && (
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="text-white text-sm" />
                          </div>
                        )}
                        <div className={`rounded-2xl p-4 max-w-md ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-r from-primary to-blue-600 text-white rounded-tr-md' 
                            : 'bg-slate-800 text-slate-200 rounded-tl-md'
                        }`}>
                          <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="text-white text-sm" />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="text-white text-sm" />
                        </div>
                        <div className="bg-slate-800 rounded-2xl rounded-tl-md p-4">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Quick Actions */}
                <div className="p-4 border-t border-slate-700">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action)}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600 rounded-full text-sm"
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-slate-700">
                  <div className="flex space-x-4">
                    <Input
                      placeholder="Ask me about your career..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <Button
                      onClick={() => handleSendMessage(currentMessage)}
                      disabled={!currentMessage.trim() || sendMessageMutation.isPending}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-500 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 flex items-center"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 flex items-center">
                    <Shield className="mr-1 h-3 w-3" />
                    Your conversations are private and secure
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Career Resources */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <Card className="bg-surface/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                    <Search className="text-emerald-500 mr-3" />
                    Job Market Insights
                  </h3>
                  <p className="text-slate-400 mb-4">Get real-time information about job trends, salary ranges, and in-demand skills in Sri Lanka and globally.</p>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Explore Jobs
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-surface/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                    <GraduationCap className="text-primary mr-3" />
                    Skill Development
                  </h3>
                  <p className="text-slate-400 mb-4">Discover learning paths, online courses, and certification programs to boost your career prospects.</p>
                  <Button className="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
