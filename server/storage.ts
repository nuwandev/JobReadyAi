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
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
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
  }

  async createCV(insertCV: InsertCV): Promise<CV> {
    const [cv] = await db
      .insert(cvs)
      .values(insertCV)
      .returning();
    return cv;
  }

  async getUserCVs(userId: string): Promise<CV[]> {
    return await db.select().from(cvs).where(eq(cvs.userId, userId));
  }

  async updateCVHtml(id: number, html: string): Promise<CV | undefined> {
    const [cv] = await db
      .update(cvs)
      .set({ generatedHtml: html, updatedAt: new Date() })
      .where(eq(cvs.id, id))
      .returning();
    return cv || undefined;
  }

  async createInterviewSession(insertSession: InsertInterviewSession): Promise<InterviewSession> {
    const [session] = await db
      .insert(interviewSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getInterviewSession(id: number): Promise<InterviewSession | undefined> {
    const [session] = await db.select().from(interviewSessions).where(eq(interviewSessions.id, id));
    return session || undefined;
  }

  async updateInterviewSession(id: number, updates: Partial<InterviewSession>): Promise<InterviewSession | undefined> {
    const [session] = await db
      .update(interviewSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(interviewSessions.id, id))
      .returning();
    return session || undefined;
  }

  async getUserInterviewSessions(userId: string): Promise<InterviewSession[]> {
    return await db.select().from(interviewSessions).where(eq(interviewSessions.userId, userId));
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const [session] = await db
      .insert(chatSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getChatSession(id: number): Promise<ChatSession | undefined> {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
    return session || undefined;
  }

  async updateChatMessages(id: number, messages: ChatSession['messages']): Promise<ChatSession | undefined> {
    const [session] = await db
      .update(chatSessions)
      .set({ messages, updatedAt: new Date() })
      .where(eq(chatSessions.id, id))
      .returning();
    return session || undefined;
  }

  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    return await db.select().from(chatSessions).where(eq(chatSessions.userId, userId));
  }
}

export const storage = new DatabaseStorage();