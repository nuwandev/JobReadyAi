import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  FileText, 
  MessageSquare, 
  Target, 
  User, 
  Calendar,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch user's data
  const { data: userCVs = [] } = useQuery({
    queryKey: ["/api/cv", user?.id],
    enabled: !!user?.id,
  });

  const { data: userInterviews = [] } = useQuery({
    queryKey: ["/api/interview", user?.id],
    enabled: !!user?.id,
  });

  const { data: userChats = [] } = useQuery({
    queryKey: ["/api/chat", user?.id],
    enabled: !!user?.id,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-primary to-blue-600 p-2 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  JobReady AI
                </h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || ""} />
                <AvatarFallback>
                  {user?.firstName?.[0] || user?.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.email
                  }
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/api/logout'}
                className="text-sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Welcome back, {user?.firstName || "there"}!
          </h2>
          <p className="text-lg text-muted-foreground">
            Continue building your career with AI-powered tools and insights.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">CVs Created</p>
                  <p className="text-3xl font-bold text-primary">{userCVs.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Interview Sessions</p>
                  <p className="text-3xl font-bold text-emerald-500">{userInterviews.length}</p>
                </div>
                <Target className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Career Chats</p>
                  <p className="text-3xl font-bold text-purple-500">{userChats.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-blue-600/10 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl group animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-primary p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Create New CV</h3>
                  <p className="text-sm text-muted-foreground">Build a professional resume</p>
                </div>
              </div>
              <Link href="/cv-builder">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Start Building
                  <Plus className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl group animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-emerald-500 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Practice Interview</h3>
                  <p className="text-sm text-muted-foreground">Improve your interview skills</p>
                </div>
              </div>
              <Link href="/interview-trainer">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                  Start Training
                  <Target className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl group animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-500 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Career Guidance</h3>
                  <p className="text-sm text-muted-foreground">Get AI-powered advice</p>
                </div>
              </div>
              <Link href="/career-guide">
                <Button className="w-full bg-purple-500 hover:bg-purple-600">
                  Get Advice
                  <MessageSquare className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent CVs */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Recent CVs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userCVs.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No CVs created yet</p>
                  <Link href="/cv-builder">
                    <Button variant="outline">Create Your First CV</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {userCVs.slice(0, 3).map((cv: any) => (
                    <div key={cv.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{cv.title || `${cv.fullName}'s CV`}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(cv.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">Ready</Badge>
                    </div>
                  ))}
                  {userCVs.length > 3 && (
                    <Link href="/cv-builder">
                      <Button variant="ghost" className="w-full">
                        View All CVs
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Interview Sessions */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Interview Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userInterviews.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No interview sessions yet</p>
                  <Link href="/interview-trainer">
                    <Button variant="outline">Start First Session</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {userInterviews.slice(0, 3).map((session: any) => (
                    <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{session.jobTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={session.completed ? "default" : "secondary"}>
                        {session.completed ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                  ))}
                  {userInterviews.length > 3 && (
                    <Link href="/interview-trainer">
                      <Button variant="ghost" className="w-full">
                        View All Sessions
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}