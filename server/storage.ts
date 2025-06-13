import {
  users,
  cvs,
  interviewSessions,
  chatSessions,
  type User,
  type InsertUser,
  type UpsertUser,
  type CV,
  type InsertCV,
  type InterviewSession,
  type InsertInterviewSession,
  type ChatSession,
  type InsertChatSession,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations for Google Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // CV operations
  createCV(cv: InsertCV): Promise<CV>;
  getUserCVs(userId: string): Promise<CV[]>;
  updateCVHtml(id: number, html: string): Promise<CV | undefined>;

  // Interview operations
  createInterviewSession(session: InsertInterviewSession): Promise<InterviewSession>;
  getInterviewSession(id: number): Promise<InterviewSession | undefined>;
  updateInterviewSession(id: number, updates: Partial<InterviewSession>): Promise<InterviewSession | undefined>;
  getUserInterviewSessions(userId: string): Promise<InterviewSession[]>;

  // Chat operations
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(id: number): Promise<ChatSession | undefined>;
  updateChatMessages(id: number, messages: ChatSession['messages']): Promise<ChatSession | undefined>;
  getUserChatSessions(userId: string): Promise<ChatSession[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations for Google Auth
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();
      return user;
    } catch (error) {
      console.error("Error upserting user:", error);
      // Return a mock user for development
      return {
        id: userData.id || "dev-user-1",
        email: userData.email || "dev@example.com",
        firstName: userData.firstName || "Dev",
        lastName: userData.lastName || "User",
        profileImageUrl: userData.profileImageUrl || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  async createCV(insertCV: InsertCV): Promise<CV> {
    try {
      const [cv] = await db
        .insert(cvs)
        .values(insertCV)
        .returning();
      return cv;
    } catch (error) {
      console.error("Error creating CV:", error);
      // Return a mock CV for development
      return {
        id: Math.floor(Math.random() * 1000),
        ...insertCV,
        generatedHtml: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  async getUserCVs(userId: string): Promise<CV[]> {
    try {
      return await db.select().from(cvs).where(eq(cvs.userId, userId));
    } catch (error) {
      console.error("Error getting user CVs:", error);
      return [];
    }
  }

  async updateCVHtml(id: number, html: string): Promise<CV | undefined> {
    try {
      const [cv] = await db
        .update(cvs)
        .set({ generatedHtml: html, updatedAt: new Date() })
        .where(eq(cvs.id, id))
        .returning();
      return cv || undefined;
    } catch (error) {
      console.error("Error updating CV HTML:", error);
      // Return a mock updated CV
      return {
        id,
        userId: "dev-user-1",
        title: "Updated CV",
        fullName: "Dev User",
        email: "dev@example.com",
        phone: null,
        location: null,
        summary: null,
        skills: [],
        experience: null,
        education: null,
        generatedHtml: html,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  async createInterviewSession(insertSession: InsertInterviewSession): Promise<InterviewSession> {
    try {
      const [session] = await db
        .insert(interviewSessions)
        .values(insertSession)
        .returning();
      return session;
    } catch (error) {
      console.error("Error creating interview session:", error);
      // Return a mock session for development
      return {
        id: Math.floor(Math.random() * 1000),
        ...insertSession,
        overallScore: null,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  async getInterviewSession(id: number): Promise<InterviewSession | undefined> {
    try {
      const [session] = await db.select().from(interviewSessions).where(eq(interviewSessions.id, id));
      return session || undefined;
    } catch (error) {
      console.error("Error getting interview session:", error);
      return undefined;
    }
  }

  async updateInterviewSession(id: number, updates: Partial<InterviewSession>): Promise<InterviewSession | undefined> {
    try {
      const [session] = await db
        .update(interviewSessions)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(interviewSessions.id, id))
        .returning();
      return session || undefined;
    } catch (error) {
      console.error("Error updating interview session:", error);
      return undefined;
    }
  }

  async getUserInterviewSessions(userId: string): Promise<InterviewSession[]> {
    try {
      return await db.select().from(interviewSessions).where(eq(interviewSessions.userId, userId));
    } catch (error) {
      console.error("Error getting user interview sessions:", error);
      return [];
    }
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    try {
      const [session] = await db
        .insert(chatSessions)
        .values(insertSession)
        .returning();
      return session;
    } catch (error) {
      console.error("Error creating chat session:", error);
      // Return a mock session for development
      return {
        id: Math.floor(Math.random() * 1000),
        ...insertSession,
        title: insertSession.title || "Career Chat",
        messages: insertSession.messages || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  async getChatSession(id: number): Promise<ChatSession | undefined> {
    try {
      const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
      return session || undefined;
    } catch (error) {
      console.error("Error getting chat session:", error);
      return undefined;
    }
  }

  async updateChatMessages(id: number, messages: ChatSession['messages']): Promise<ChatSession | undefined> {
    try {
      const [session] = await db
        .update(chatSessions)
        .set({ messages, updatedAt: new Date() })
        .where(eq(chatSessions.id, id))
        .returning();
      return session || undefined;
    } catch (error) {
      console.error("Error updating chat messages:", error);
      return undefined;
    }
  }

  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    try {
      return await db.select().from(chatSessions).where(eq(chatSessions.userId, userId));
    } catch (error) {
      console.error("Error getting user chat sessions:", error);
      return [];
    }
  }
}

export const storage = new DatabaseStorage();