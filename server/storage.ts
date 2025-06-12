import { 
  users, cvs, interviewSessions, chatSessions,
  type User, type InsertUser,
  type CV, type InsertCV,
  type InterviewSession, type InsertInterviewSession,
  type ChatSession, type InsertChatSession
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // CV operations
  createCV(cv: InsertCV): Promise<CV>;
  getUserCVs(userId: number): Promise<CV[]>;
  updateCVHtml(id: number, html: string): Promise<CV | undefined>;

  // Interview operations
  createInterviewSession(session: InsertInterviewSession): Promise<InterviewSession>;
  getInterviewSession(id: number): Promise<InterviewSession | undefined>;
  updateInterviewSession(id: number, updates: Partial<InterviewSession>): Promise<InterviewSession | undefined>;
  getUserInterviewSessions(userId: number): Promise<InterviewSession[]>;

  // Chat operations
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(id: number): Promise<ChatSession | undefined>;
  updateChatMessages(id: number, messages: ChatSession['messages']): Promise<ChatSession | undefined>;
  getUserChatSessions(userId: number): Promise<ChatSession[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private cvs: Map<number, CV> = new Map();
  private interviewSessions: Map<number, InterviewSession> = new Map();
  private chatSessions: Map<number, ChatSession> = new Map();
  private currentId = 1;

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // CV operations
  async createCV(insertCV: InsertCV): Promise<CV> {
    const id = this.currentId++;
    const cv: CV = {
      ...insertCV,
      id,
      userId: insertCV.userId || null,
      phone: insertCV.phone || null,
      location: insertCV.location || null,
      summary: insertCV.summary || null,
      skills: insertCV.skills || null,
      experience: insertCV.experience || null,
      education: insertCV.education || null,
      generatedHtml: null,
      createdAt: new Date()
    };
    this.cvs.set(id, cv);
    return cv;
  }

  async getUserCVs(userId: number): Promise<CV[]> {
    return Array.from(this.cvs.values()).filter(cv => cv.userId === userId);
  }

  async updateCVHtml(id: number, html: string): Promise<CV | undefined> {
    const cv = this.cvs.get(id);
    if (cv) {
      const updated = { ...cv, generatedHtml: html };
      this.cvs.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Interview operations
  async createInterviewSession(insertSession: InsertInterviewSession): Promise<InterviewSession> {
    const id = this.currentId++;
    const session: InterviewSession = {
      ...insertSession,
      id,
      questions: insertSession.questions || [],
      overallScore: null,
      completed: false,
      createdAt: new Date()
    };
    this.interviewSessions.set(id, session);
    return session;
  }

  async getInterviewSession(id: number): Promise<InterviewSession | undefined> {
    return this.interviewSessions.get(id);
  }

  async updateInterviewSession(id: number, updates: Partial<InterviewSession>): Promise<InterviewSession | undefined> {
    const session = this.interviewSessions.get(id);
    if (session) {
      const updated = { ...session, ...updates };
      this.interviewSessions.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async getUserInterviewSessions(userId: number): Promise<InterviewSession[]> {
    return Array.from(this.interviewSessions.values()).filter(session => session.userId === userId);
  }

  // Chat operations
  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = this.currentId++;
    const session: ChatSession = {
      ...insertSession,
      id,
      messages: insertSession.messages || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async getChatSession(id: number): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async updateChatMessages(id: number, messages: ChatSession['messages']): Promise<ChatSession | undefined> {
    const session = this.chatSessions.get(id);
    if (session) {
      const updated = { ...session, messages, updatedAt: new Date() };
      this.chatSessions.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async getUserChatSessions(userId: number): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values()).filter(session => session.userId === userId);
  }
}

export const storage = new MemStorage();
