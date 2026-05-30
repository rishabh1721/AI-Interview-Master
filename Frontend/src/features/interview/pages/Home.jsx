import React, { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const { loading, generateReport } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume] = useState(null);
  const resumeInputRef = useRef(null);
  const navigate = useNavigate();
  const handleGenerateReport = async () => {
    try {
      const resumeFile = resumeInputRef.current?.files?.[0];
      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      console.log("Interview Report Response:", data);
      const interviewId =
        data?.interviewReport?._id ||
        data?.data?.interviewReport?._id ||
        data?._id;
      if (!interviewId) {
        throw new Error("Interview ID not found in response");
      }
      navigate(`/interview/${interviewId}`);
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to generate interview report",
      );
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      alert("Please upload your resume.");
      return;
    }
    if (!jobDescription.trim()) {
      alert("Please enter a job description.");
      return;
    }
    if (!selfDescription.trim()) {
      alert("Please enter your self description.");
      return;
    }
    await handleGenerateReport();
  };
  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loading-content">
          <div className="loader"></div>
          <h1>Generating Your Interview Strategy...</h1>
          <p>Please wait while AI analyzes your profile.</p>
        </div>
      </main>
    );
  }
  return (
    <main className="home">
      <div className="ambient-glow glow-top-left"></div>
      <div className="ambient-glow glow-bottom-right"></div>
      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-badge">
            <span className="sparkle">✨</span>
            AI Interview Preparation Platform
          </div>
          <h1>
            Turn Any Job Description Into
            <br />
            <span className="text-gradient">Your Interview Strategy</span>
          </h1>
          <p>
            Upload your resume, paste the job description, and receive
            personalized interview questions, skill-gap analysis, match score,
            and a complete preparation roadmap tailored specifically for you.
          </p>
          <div className="hero-stats">
            <div className="stat-box">
              <h3>10+</h3>
              <span>Technical Q's</span>
            </div>
            <div className="stat-box">
              <h3>5+</h3>
              <span>Behavioral Q's</span>
            </div>
            <div className="stat-box">
              <h3>7-Day</h3>
              <span>Prep Plan</span>
            </div>
            <div className="stat-box">
              <h3>AI</h3>
              <span>Skill Gap Analysis</span>
            </div>
          </div>
        </section>
        {/* Feature Cards */}
        <section className="features">
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Resume Analysis</h3>
            <p>
              AI extracts skills, projects, achievements, and identifies
              strengths and weaknesses.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Job Matching</h3>
            <p>
              Compare your profile against the target role and receive a
              realistic match score.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Interview Questions</h3>
            <p>
              Generate personalized technical and behavioral questions based on
              your resume.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Skill Gap Detection</h3>
            <p>
              Discover exactly what skills are missing and how to improve before
              interviews.
            </p>
          </div>
        </section>
        {/* Main Form */}
        <form className="interview-form" onSubmit={handleSubmit}>
          {/* Left Side */}
          <section className="form-column">
            <div className="glass-panel main-panel">
              <div className="panel-header">
                <div className="title-group">
                  <span className="step-badge">Step 1</span>
                  <h2>Target Job Description</h2>
                </div>
                <p>
                  Paste the complete job description from LinkedIn, Naukri,
                  Wellfound, or company career pages.
                </p>
              </div>
              <textarea
                className="tall-textarea"
                placeholder="Paste complete job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </section>
          {/* Right Side */}
          <section className="form-column side-column">
            <div className="glass-panel">
              <div className="panel-header">
                <div className="title-group">
                  <span className="step-badge">Step 2</span>
                  <h2>Resume Upload</h2>
                </div>
                <p>Upload your latest resume in PDF format.</p>
              </div>
              <label className="file-upload-zone">
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setResume(e.target.files[0])}
                />
                <div className="upload-content">
                  <span className="upload-icon">⬆️</span>
                  <span className="upload-title">
                    {resume ? resume.name : "Click to upload your resume"}
                  </span>
                  <span className="upload-subtitle">PDF • Max 5MB</span>
                </div>
              </label>
            </div>
            <div className="glass-panel flex-grow">
              <div className="panel-header">
                <div className="title-group">
                  <span className="step-badge">Step 3</span>
                  <h2>About Yourself</h2>
                </div>
                <p>
                  Share your experience, projects, skills, achievements, and
                  career goals.
                </p>
              </div>
              <textarea
                placeholder="Tell us about yourself..."
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
              />
            </div>
            <button type="submit" className="generate-btn">
              <span>Generate Interview Report</span>
            </button>
          </section>
        </form>
      </div>
    </main>
  );
};
export default Home;
