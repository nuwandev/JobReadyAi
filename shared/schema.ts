import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cvs = pgTable("cvs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  summary: text("summary"),
  skills: text("skills").array(),
  experience: text("experience"),
  education: text("education"),
  generatedHtml: text("generated_html"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const interviewSessions = pgTable("interview_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  jobTitle: text("job_title").notNull(),
  questions: jsonb("questions").$type<Array<{
    question: string;
    answer?: string;
    feedback?: string;
    score?: number;
  }>>(),
  overallScore: integer("overall_score"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  messages: jsonb("messages").$type<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertCvSchema = createInsertSchema(cvs).omit({
  id: true,
  createdAt: true,
  generatedHtml: true,
});

export const insertInterviewSessionSchema = createInsertSchema(interviewSessions).omit({
  id: true,
  createdAt: true,
  overallScore: true,
  completed: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type CV = typeof cvs.$inferSelect;
export type InsertCV = z.infer<typeof insertCvSchema>;

export type InterviewSession = typeof interviewSessions.$inferSelect;
export type InsertInterviewSession = z.infer<typeof insertInterviewSessionSchema>;

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
