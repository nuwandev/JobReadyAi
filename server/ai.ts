import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-test-key-for-development"
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
  // Mock response for development when no API key is provided
  if (process.env.OPENAI_API_KEY === "sk-test-key-for-development" || !process.env.OPENAI_API_KEY) {
    return `
      <div class="max-w-4xl mx-auto bg-white p-8 shadow-lg">
        <header class="border-b-2 border-gray-200 pb-6 mb-6">
          <h1 class="text-3xl font-bold text-gray-800">${cvData.fullName}</h1>
          <div class="text-gray-600 mt-2">
            <p>${cvData.email}</p>
            ${cvData.phone ? `<p>${cvData.phone}</p>` : ''}
            ${cvData.location ? `<p>${cvData.location}</p>` : ''}
          </div>
        </header>
        
        ${cvData.summary ? `
        <section class="mb-6">
          <h2 class="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-3">Professional Summary</h2>
          <p class="text-gray-700 leading-relaxed">${cvData.summary}</p>
        </section>
        ` : ''}
        
        ${cvData.skills && cvData.skills.length > 0 ? `
        <section class="mb-6">
          <h2 class="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-3">Skills</h2>
          <div class="flex flex-wrap gap-2">
            ${cvData.skills.map(skill => `<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">${skill}</span>`).join('')}
          </div>
        </section>
        ` : ''}
        
        ${cvData.experience ? `
        <section class="mb-6">
          <h2 class="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-3">Experience</h2>
          <div class="text-gray-700 leading-relaxed whitespace-pre-line">${cvData.experience}</div>
        </section>
        ` : ''}
        
        ${cvData.education ? `
        <section class="mb-6">
          <h2 class="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-3">Education</h2>
          <div class="text-gray-700 leading-relaxed whitespace-pre-line">${cvData.education}</div>
        </section>
        ` : ''}
      </div>
    `;
  }

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
  // Mock response for development
  if (process.env.OPENAI_API_KEY === "sk-test-key-for-development" || !process.env.OPENAI_API_KEY) {
    return [
      {
        question: "Tell me about yourself and your background.",
        expectedPoints: ["Background summary", "Relevant experience", "Career goals"]
      },
      {
        question: `What interests you about working as a ${jobTitle}?`,
        expectedPoints: ["Passion for the role", "Understanding of responsibilities", "Career alignment"]
      },
      {
        question: "What are your greatest strengths?",
        expectedPoints: ["Specific skills", "Examples", "Relevance to role"]
      },
      {
        question: "Describe a challenging situation you faced and how you handled it.",
        expectedPoints: ["Problem description", "Actions taken", "Results achieved"]
      },
      {
        question: "Where do you see yourself in 5 years?",
        expectedPoints: ["Career goals", "Growth mindset", "Commitment"]
      },
      {
        question: "Why should we hire you for this position?",
        expectedPoints: ["Unique value proposition", "Skills match", "Enthusiasm"]
      },
      {
        question: "What are your salary expectations?",
        expectedPoints: ["Market research", "Flexibility", "Value focus"]
      },
      {
        question: "Do you have any questions for us?",
        expectedPoints: ["Company culture", "Role expectations", "Growth opportunities"]
      }
    ];
  }

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
  // Mock response for development
  if (process.env.OPENAI_API_KEY === "sk-test-key-for-development" || !process.env.OPENAI_API_KEY) {
    const score = Math.floor(Math.random() * 4) + 6; // Random score between 6-10
    return {
      score,
      feedback: `Good answer! You provided relevant information and showed understanding of the role. ${score >= 8 ? 'Your response was well-structured and demonstrated strong communication skills.' : 'Consider adding more specific examples to strengthen your response.'}`,
      suggestions: [
        "Add specific examples from your experience",
        "Quantify your achievements where possible",
        "Connect your answer more directly to the job requirements"
      ]
    };
  }

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
  // Mock response for development
  if (process.env.OPENAI_API_KEY === "sk-test-key-for-development" || !process.env.OPENAI_API_KEY) {
    const responses = [
      "That's a great question! Based on current market trends, I'd recommend focusing on developing both technical and soft skills. Consider exploring remote work opportunities which are increasingly available globally.",
      "For career development in Sri Lanka and developing countries, I suggest building a strong online presence through platforms like LinkedIn and GitHub. Remote work can open up international opportunities.",
      "Skill development is key to career growth. Consider online courses, certifications, and practical projects. Focus on in-demand skills like digital marketing, programming, or data analysis.",
      "The job market is evolving rapidly. Stay updated with industry trends, network actively, and don't hesitate to apply for positions that stretch your capabilities - growth happens outside your comfort zone!",
      "Building a professional network is crucial. Attend virtual events, join professional groups, and engage with industry content online. Many opportunities come through connections."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

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