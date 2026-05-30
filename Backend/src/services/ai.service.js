const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100),
  optimizedResume: z.object({
    name: z.string(),
    contactInfo: z.string(),
    summary: z.string(),
    // Changed from string to array of strings for better flexibility
    skills: z.array(z.string()),
    experience: z.array(
      z.object({
        title: z.string(),
        company: z.string(),
        duration: z.string(),
        achievements: z.array(z.string()),
      }),
    ),
    education: z.array(
      z.object({
        degree: z.string(),
        institution: z.string(),
        year: z.string(),
      }),
    ),
  }),
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }),
  ),
  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }),
  ),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["Low", "Medium", "High"]),
    }),
  ),
  preparationPlan: z.array(
    z.object({ day: z.number(), focus: z.string(), tasks: z.string() }),
  ),
});

async function generateInterviewReport(
  resume,
  selfDescription,
  jobDescription,
) {
  const prompt = `
You are an expert technical recruiter, hiring manager, and top-tier resume writer.

Analyze the candidate profile and generate a comprehensive interview report AND a highly optimized, ATS-friendly resume.

RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

Requirements:
1. Calculate a realistic match score (0-100).
2. GENERATE AN OPTIMIZED RESUME: Tailor the candidate's past experience strictly to the provided Job Description. 
   - Use high-impact action verbs.
   - Quantify achievements where possible.
   - Format it precisely matching the JSON schema provided below.
   - SKILLS MUST BE AN ARRAY OF STRINGS (e.g., ["React.js", "Node.js", "MongoDB"]).
3. Generate exactly 10 technical interview questions (question, intention, answer).
4. Generate exactly 5 behavioral interview questions (question, intention, answer).
5. Identify skill gaps with severity (Low, Medium, High).
6. Create a 7-day preparation plan (day, focus, tasks).

Return ONLY valid JSON exactly matching this structure. Do not include markdown formatting.

{
  "matchScore": 85,
  "optimizedResume": {
    "name": "Candidate Name",
    "contactInfo": "Email | Phone | LinkedIn",
    "summary": "A highly motivated...",
    "skills": ["React", "Node.js", "MongoDB", "Express"],
    "experience": [
      {
        "title": "Software Engineer",
        "company": "Tech Corp",
        "duration": "Jan 2022 - Present",
        "achievements": [
          "Developed X using Y which increased Z by 20%",
          "Collaborated with..."
        ]
      }
    ],
    "education": [
      {
        "degree": "B.S. Computer Science",
        "institution": "University Name",
        "year": "2023"
      }
    ]
  },
  "technicalQuestions": [
    {
      "question": "Explain React Hooks",
      "intention": "Test React fundamentals",
      "answer": "Hooks allow functional components..."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Tell me about a challenge...",
      "intention": "Assess problem solving",
      "answer": "Candidate should explain..."
    }
  ],
  "skillGaps": [
    {
      "skill": "AWS",
      "severity": "Medium"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "DSA",
      "tasks": "Practice arrays and strings."
    }
  ]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let rawText = response.text;
    if (rawText.startsWith("```")) {
      rawText = rawText
        .replace(/```json/gi, "")
        .replace(/```/gi, "")
        .trim();
    }

    const parsed = JSON.parse(rawText);
    const validatedReport = interviewReportSchema.parse(parsed);

    return validatedReport;
  } catch (error) {
    console.error("Error generating interview report:", error);

    if (error.issues) {
      console.error(
        "Zod Validation Errors:",
        JSON.stringify(error.issues, null, 2),
      );
    }

    throw new Error("Failed to generate interview report");
  }
}

module.exports = {
  generateInterviewReport,
};
