import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";
import html2pdf from "html2pdf.js"; // Import the PDF library
import "../style/interview.scss";

// Reusable Question Component with Accordion functionality (Styled)
const QuestionCard = ({ item, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`question-card ${isOpen ? "open" : ""}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="card-top">
        <span className="q-number">Q{index + 1}</span>

        <h4 className="q-text">{item.question}</h4>

        <div className="toggle-icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isOpen ? (
              <polyline points="18 15 12 9 6 15" />
            ) : (
              <polyline points="6 9 12 15 18 9" />
            )}
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="card-expanded">
          <div className="intention">
            <strong>Intention:</strong> {item.intention}
          </div>

          <div className="answer">
            <strong>Suggested Answer:</strong>
            <p>{item.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Interview = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const reportRef = useRef(); // Ref to target the printable area
  const [isDownloading, setIsDownloading] = useState(false); // Loading state for PDF

  // Custom hook logic from your source code
  const { report, loading, getResumePdf } = useInterview();

  const handleDownloadReport = () => {
    setIsDownloading(true);
    const element = reportRef.current;

    const opt = {
      margin: 0.5,
      filename: `Interview_Strategy_${interviewId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#000000" }, // Preserves your dark background
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        setIsDownloading(false);
      })
      .catch((err) => {
        console.error("PDF Generation Error:", err);
        setIsDownloading(false);
      });
  };

  // Loading Screen using the main layout background for consistency
  if (loading || !report) {
    return (
      <main
        className="interview-page"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="ambient-glow glow-top-left"></div>
        <div
          className="glass-panel"
          style={{ padding: "40px", textAlign: "center" }}
        >
          <h2>Loading Interview Report...</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>
            Analyzing your profile against the target role.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="interview-page">
      <div className="ambient-glow glow-top-left"></div>

      <div className="container">
        {/* Navigation / Header - NOT included in PDF */}
        <nav className="page-nav">
          <button onClick={() => navigate("/")} className="back-btn">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </button>

          <div style={{ display: "flex", gap: "12px" }}>
            {/* Download Report Button */}
            <button
              className="back-btn"
              style={{
                border: "1px solid var(--border)",
                padding: "6px 12px",
                borderRadius: "6px",
                background: isDownloading
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
              }}
              onClick={handleDownloadReport}
              disabled={isDownloading}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "6px" }}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              {isDownloading ? "Generating PDF..." : "Download Report"}
            </button>

            {/* Existing Resume Download Button */}
            <button
              className="back-btn"
              style={{
                border: "1px solid var(--border)",
                padding: "6px 12px",
                borderRadius: "6px",
              }}
              onClick={() => getResumePdf(interviewId)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "6px" }}
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Resume
            </button>
          </div>
        </nav>

        {/* --- START OF PRINTABLE AREA --- */}
        <div ref={reportRef} style={{ padding: "20px" }}>
          {/* Add a hidden title that only shows up in the PDF for a professional look */}
          <div style={{ marginBottom: "32px", textAlign: "center" }}>
            <h1
              style={{ fontSize: "24px", color: "#fff", marginBottom: "8px" }}
            >
              AI Interview Strategy Report
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              Report ID: {interviewId}
            </p>
          </div>

          {/* Top Section: Score & Gaps */}
          <section className="dashboard-top">
            <div className="glass-panel score-panel">
              <h3>Match Score</h3>

              <div className="score-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    className="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="circle"
                    strokeDasharray={`${report.matchScore || 0}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>

                <div className="score-text">
                  <span className="number">{report.matchScore || 0}</span>
                  <span className="percent">%</span>
                </div>
              </div>

              <p>AI generated compatibility score</p>
            </div>

            <div className="glass-panel gaps-panel">
              <div className="panel-header">
                <h2>Skill Gap Analysis</h2>
                <p>Areas to focus on before the interview</p>
              </div>

              <div className="gaps-list">
                {report?.skillGaps?.map((gap, i) => (
                  <div key={i} className="gap-item">
                    <span className="gap-name">{gap.skill}</span>
                    <span
                      className={`gap-severity severity-${gap.severity.toLowerCase()}`}
                    >
                      {gap.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Middle Section: Preparation Timeline */}
          <section className="glass-panel timeline-panel">
            <div className="panel-header">
              <h2>Preparation Roadmap</h2>
              <p>Your personalized day-by-day action plan.</p>
            </div>

            <div className="timeline">
              {report?.preparationPlan?.map((plan, i) => (
                <div key={i} className="timeline-item">
                  <div className="day-marker">Day {plan.day}</div>
                  <div className="day-content">
                    <h4>{plan.focus}</h4>
                    <p>{plan.tasks}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Section: Questions */}
          <section className="questions-section">
            <div className="glass-panel">
              <div className="panel-header">
                <h2>Technical Questions</h2>
                <p>
                  Simulated questions based on your resume and the target role.
                </p>
              </div>

              <div className="questions-list">
                {report?.technicalQuestions?.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </div>

            <div className="glass-panel mt-6">
              <div className="panel-header">
                <h2>Behavioral Questions</h2>
                <p>
                  Prepare your STAR method responses for these common scenarios.
                </p>
              </div>

              <div className="questions-list">
                {report?.behavioralQuestions?.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </div>
          </section>
        </div>
        {/* --- END OF PRINTABLE AREA --- */}
      </div>
    </main>
  );
};

export default Interview;
