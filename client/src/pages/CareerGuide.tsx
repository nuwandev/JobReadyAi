import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { TypingIndicator } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Bot, User, Send, Shield, Search, GraduationCap, Sparkles, MessageCircle, TrendingUp } from "lucide-react";
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      
      <section className="py-12 lg:py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-3 rounded-2xl">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              AI Career Guide
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get personalized career advice, discover job opportunities, and receive guidance tailored to your goals.
            </p>
            <div className="flex justify-center mt-6">
              <Badge variant="outline" className="px-4 py-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
                <Sparkles className="w-4 h-4 mr-2" />
                Powered by Advanced AI
              </Badge>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Chat Interface */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden shadow-2xl animate-slide-up">
              {/* Chat Header */}
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 lg:p-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse-soft">
                    <Bot className="text-white text-xl lg:text-2xl" />
                  </div>
                  <div>
                    <CardTitle className="text-xl lg:text-2xl font-semibold text-white">Career AI Assistant</CardTitle>
                    <p className="text-emerald-100 text-sm lg:text-base">Ready to help with your career journey</p>
                  </div>
                  <div className="hidden sm:flex ml-auto">
                    <Badge className="bg-white/20 text-white border-white/30">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Online
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              {/* Chat Messages */}
              <CardContent className="p-0">
                <ScrollArea className="h-80 sm:h-96 lg:h-[500px] p-4 lg:p-6">
                  <div className="space-y-4 lg:space-y-6">
                    {messages.map((message, index) => (
                      <div 
                        key={index} 
                        className={`flex items-start space-x-3 lg:space-x-4 animate-slide-up ${
                          message.role === 'user' ? 'justify-end' : ''
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Bot className="text-white text-sm lg:text-base" />
                          </div>
                        )}
                        <div className={`rounded-2xl p-3 lg:p-4 max-w-sm lg:max-w-md transition-all duration-300 ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-r from-primary to-blue-600 text-primary-foreground rounded-tr-md shadow-lg' 
                            : 'bg-muted text-muted-foreground rounded-tl-md border border-border/50'
                        }`}>
                          <p className="leading-relaxed whitespace-pre-wrap text-sm lg:text-base">{message.content}</p>
                          <span className="text-xs opacity-70 mt-2 block">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            <User className="text-white text-sm lg:text-base" />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex items-start space-x-3 lg:space-x-4 animate-fade-in">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="text-white text-sm lg:text-base" />
                        </div>
                        <div className="bg-muted rounded-2xl rounded-tl-md p-3 lg:p-4 border border-border/50">
                          <TypingIndicator />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Quick Actions */}
                <div className="p-4 lg:p-6 border-t border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-3 font-medium">Quick Questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action)}
                        className="text-xs lg:text-sm rounded-full transition-all duration-300 hover:scale-105 hover:shadow-md"
                        disabled={sendMessageMutation.isPending}
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 lg:p-6 border-t border-border">
                  <div className="flex space-x-3 lg:space-x-4">
                    <Input
                      placeholder="Ask me about your career goals, job market, skills..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={sendMessageMutation.isPending}
                      className="flex-1 transition-all duration-200 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <Button
                      onClick={() => handleSendMessage(currentMessage)}
                      disabled={!currentMessage.trim() || sendMessageMutation.isPending}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-500 text-white font-medium px-4 lg:px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center lg:justify-start">
                    <Shield className="mr-1 h-3 w-3" />
                    Your conversations are private and secure
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Career Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-8 lg:mt-12">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl animate-slide-up hover:shadow-2xl transition-all duration-500 group" style={{ animationDelay: '0.3s' }}>
                <CardContent className="p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-semibold mb-4 text-foreground flex items-center group-hover:text-emerald-600 transition-colors">
                    <Search className="text-emerald-500 mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                    Job Market Insights
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">Get real-time information about job trends, salary ranges, and in-demand skills in Sri Lanka and globally.</p>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Explore Jobs
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl animate-slide-up hover:shadow-2xl transition-all duration-500 group" style={{ animationDelay: '0.4s' }}>
                <CardContent className="p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-semibold mb-4 text-foreground flex items-center group-hover:text-primary transition-colors">
                    <GraduationCap className="text-primary mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                    Skill Development
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">Discover learning paths, online courses, and certification programs to boost your career prospects.</p>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
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
