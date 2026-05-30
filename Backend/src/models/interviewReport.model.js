const mongoose = require("mongoose");

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required."],
    },
    intention: {
      type: String,
      required: [true, "Intention is required."],
    },
    answer: {
      type: String,
      required: [true, "Answer is required."],
    },
  },
  { _id: false },
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required."],
    },
    intention: {
      type: String,
      required: [true, "Intention is required."],
    },
    answer: {
      type: String,
      required: [true, "Answer is required."],
    },
  },
  { _id: false },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required."],
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: [true, "Severity is required."],
    },
  },
  { _id: false },
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day is required."],
    },
    focus: {
      type: String,
      required: [true, "Focus is required."],
    },
    tasks: {
      type: String,
      required: [true, "Tasks are required."],
    },
  },
  { _id: false },
);

const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: [true, "Job description is required."],
    },
    resume: {
      type: String,
    },
    // --- THIS IS THE CRITICAL FIX ---
    optimizedResume: {
      type: mongoose.Schema.Types.Mixed,
    },
    // --------------------------------
    selfDescription: {
      type: String,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User reference is required."],
    },
    title: {
      type: String,
      required: [true, "Title is required."],
    },
  },
  {
    timestamps: true,
  },
);

const InterviewReportModel = mongoose.model(
  "InterviewReport",
  interviewReportSchema,
);
module.exports = InterviewReportModel;
