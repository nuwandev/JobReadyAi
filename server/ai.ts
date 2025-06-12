import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface CVData {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills?: string[];
  experience?: string;
  education?: string;
}

export interface InterviewQuestion {
  question: string;
  expectedPoints?: string[];
}

export interface InterviewFeedback {
  score: number;
  feedback: string;
  suggestions: string[];
}

export async function generateCVHTML(cvData: CVData): Promise<string> {
  const prompt = `
    Create a professional HTML CV using the following information. 
    Use modern, clean styling with Tailwind CSS classes.
    Include proper semantic HTML structure.
    Make it print-friendly and professional.
    
    Data: ${JSON.stringify(cvData)}
    
    Return only the HTML content without any markdown formatting.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    throw new Error(`Failed to generate CV: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateInterviewQuestions(jobTitle: string, count: number = 8): Promise<InterviewQuestion[]> {
  const prompt = `
    Generate ${count} realistic interview questions for a ${jobTitle} position.
    Focus on questions commonly asked in entry-level to mid-level positions.
    Include a mix of technical, behavioral, and situational questions.
    
    Return the response as a JSON object with this structure:
    {
      "questions": [
        {
          "question": "Tell me about yourself",
          "expectedPoints": ["Background summary", "Relevant experience", "Career goals"]
        }
      ]
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert HR interviewer. Generate professional interview questions with expected answer points."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.questions || [];
  } catch (error) {
    throw new Error(`Failed to generate interview questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function evaluateInterviewAnswer(
  question: string,
  answer: string,
  jobTitle: string
): Promise<InterviewFeedback> {
  const prompt = `
    Evaluate this interview answer for a ${jobTitle} position.
    
    Question: ${question}
    Answer: ${answer}
    
    Provide a score from 1-10 and constructive feedback.
    Include specific suggestions for improvement.
    
    Return response as JSON:
    {
      "score": 7,
      "feedback": "Good start but could be more specific...",
      "suggestions": ["Add specific examples", "Quantify achievements"]
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert interview coach. Provide constructive, encouraging feedback."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      score: Math.max(1, Math.min(10, result.score || 5)),
      feedback: result.feedback || "No feedback available",
      suggestions: result.suggestions || []
    };
  } catch (error) {
    throw new Error(`Failed to evaluate answer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateCareerAdvice(message: string, chatHistory: Array<{role: string, content: string}>): Promise<string> {
  const systemPrompt = `
    You are a career counselor specializing in helping students and job seekers in Sri Lanka and developing countries.
    Provide practical, encouraging, and actionable career advice.
    Focus on remote work opportunities, skill development, and local job market insights.
    Be supportive and motivational while being realistic about challenges.
    Keep responses concise but helpful.
  `;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.slice(-10), // Keep last 10 messages for context
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response right now.";
  } catch (error) {
    throw new Error(`Failed to generate career advice: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
