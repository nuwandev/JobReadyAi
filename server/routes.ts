import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  generateCVHTML, 
  generateInterviewQuestions, 
  evaluateInterviewAnswer, 
  generateCareerAdvice 
} from "./ai";
import { 
  insertCvSchema, 
  insertInterviewSessionSchema, 
  insertChatSessionSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // For development, return a mock user if not authenticated
      if (!req.user) {
        return res.json({
          id: "dev-user-1",
          email: "dev@example.com",
          firstName: "Dev",
          lastName: "User",
          profileImageUrl: null
        });
      }

      const userId = req.user.claims?.sub || "dev-user-1";
      const user = await storage.getUser(userId);
      res.json(user || {
        id: userId,
        email: req.user.claims?.email || "dev@example.com",
        firstName: req.user.claims?.first_name || "Dev",
        lastName: req.user.claims?.last_name || "User",
        profileImageUrl: req.user.claims?.profile_image_url || null
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // CV Builder routes
  app.post("/api/cv/generate", async (req, res) => {
    try {
      const cvData = insertCvSchema.parse(req.body);
      
      // Create CV record
      const cv = await storage.createCV(cvData);
      
      // Generate HTML with AI
      const generatedHtml = await generateCVHTML({
        fullName: cvData.fullName,
        email: cvData.email,
        phone: cvData.phone || undefined,
        location: cvData.location || undefined,
        summary: cvData.summary || undefined,
        skills: cvData.skills || undefined,
        experience: cvData.experience || undefined,
        education: cvData.education || undefined,
      });
      
      // Update CV with generated HTML
      const updatedCV = await storage.updateCVHtml(cv.id, generatedHtml);
      
      res.json(updatedCV);
    } catch (error) {
      console.error("CV generation error:", error);
      res.status(500).json({ 
        message: "Failed to generate CV", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/cv/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const cvs = await storage.getUserCVs(userId);
      res.json(cvs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch CVs" });
    }
  });

  // Interview Trainer routes
  app.post("/api/interview/start", async (req, res) => {
    try {
      const sessionData = insertInterviewSessionSchema.parse(req.body);
      
      // Generate questions
      const questions = await generateInterviewQuestions(sessionData.jobTitle);
      
      // Create session with questions
      const session = await storage.createInterviewSession({
        ...sessionData,
        questions: questions.map(q => ({ question: q.question }))
      });
      
      res.json(session);
    } catch (error) {
      console.error("Interview start error:", error);
      res.status(500).json({ 
        message: "Failed to start interview", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.post("/api/interview/:sessionId/answer", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const { questionIndex, answer } = req.body;
      
      const session = await storage.getInterviewSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Interview session not found" });
      }

      const questions = session.questions || [];
      if (questionIndex >= questions.length) {
        return res.status(400).json({ message: "Invalid question index" });
      }

      const question = questions[questionIndex];
      
      // Get AI feedback
      const feedback = await evaluateInterviewAnswer(
        question.question,
        answer,
        session.jobTitle
      );

      // Update question with answer and feedback
      questions[questionIndex] = {
        ...question,
        answer,
        feedback: feedback.feedback,
        score: feedback.score
      };

      // Calculate overall score if all questions answered
      const answeredQuestions = questions.filter(q => q.answer);
      let overallScore = null;
      let completed = false;

      if (answeredQuestions.length === questions.length) {
        overallScore = Math.round(
          questions.reduce((sum, q) => sum + (q.score || 0), 0) / questions.length
        );
        completed = true;
      }

      const updatedSession = await storage.updateInterviewSession(sessionId, {
        questions,
        overallScore,
        completed
      });

      res.json({ 
        session: updatedSession, 
        feedback: {
          score: feedback.score,
          feedback: feedback.feedback,
          suggestions: feedback.suggestions
        }
      });
    } catch (error) {
      console.error("Answer evaluation error:", error);
      res.status(500).json({ 
        message: "Failed to evaluate answer", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/interview/:sessionId", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const session = await storage.getInterviewSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Interview session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interview session" });
    }
  });

  app.get("/api/interview/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const sessions = await storage.getUserInterviewSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interview sessions" });
    }
  });

  // Career Guide Chat routes
  app.post("/api/chat/start", async (req, res) => {
    try {
      const sessionData = insertChatSessionSchema.parse(req.body);
      
      const session = await storage.createChatSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to start chat session" });
    }
  });

  app.post("/api/chat/:sessionId/message", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const { message } = req.body;
      
      const session = await storage.getChatSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      const currentMessages = session.messages || [];
      
      // Add user message
      const userMessage = {
        role: 'user' as const,
        content: message,
        timestamp: new Date().toISOString()
      };

      // Generate AI response
      const aiResponse = await generateCareerAdvice(message, currentMessages);
      
      const assistantMessage = {
        role: 'assistant' as const,
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      // Update session with both messages
      const updatedMessages = [...currentMessages, userMessage, assistantMessage];
      const updatedSession = await storage.updateChatMessages(sessionId, updatedMessages);

      res.json({ 
        session: updatedSession,
        response: aiResponse 
      });
    } catch (error) {
      console.error("Chat message error:", error);
      res.status(500).json({ 
        message: "Failed to process chat message", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const session = await storage.getChatSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat session" });
    }
  });

  app.get("/api/chat/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const sessions = await storage.getUserChatSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat sessions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}