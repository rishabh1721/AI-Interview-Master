<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=250&section=header&text=AI%20Interview%20Master&fontSize=70&fontAlignY=35&animation=twinkling&fontColor=ffffff" alt="AI Interview Master Banner" />

# 🚀 AI Interview Master

*Your Ultimate AI-Powered Career and Interview Preparation Strategist*

An advanced platform that transforms a candidate’s resume, target job description, and self-introduction into a **complete, highly personalized interview preparation roadmap**.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![Gemini AI](https://img.shields.io/badge/Gemini_2.5-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](#)

[Explore the Features](#-key-features) • [View Architecture](#-system-architecture) • [Installation](#-installation) • [Future Scope](#-future-enhancements)

---

</div>

## 🌟 Key Features

<table>
  <tr>
    <td width="50%">
      <h3>📄 Smart Resume Analysis</h3>
      <ul>
        <li>Upload resumes in <code>PDF</code> format.</li>
        <li>Automatic extraction of skills, projects, experience, and education.</li>
        <li>Deep analysis of candidate strengths and weaknesses.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🎯 Precision Job Matching</h3>
      <ul>
        <li>Compares candidate profile against specific job requirements.</li>
        <li>Generates a highly realistic <b>Match Score</b>.</li>
        <li>Highlights missing skills and clear improvement opportunities.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🤖 AI Interview Generation</h3>
      <ul>
        <li><b>Technical & Behavioral</b> questions tailored to the exact role.</li>
        <li>Extracts interview intentions behind every question.</li>
        <li>Provides AI-suggested optimal answers.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>📈 Skill Gap Analysis</h3>
      <ul>
        <li>Categorizes knowledge gaps into: <br>🔴 <i>High</i> 🟡 <i>Medium</i> 🟢 <i>Low</i> priority.</li>
        <li>Helps candidates optimize their study time before the big day.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🗺️ Preparation Roadmap</h3>
      <ul>
        <li>Personalized, day-wise learning roadmap.</li>
        <li>Targeted technical & behavioral preparation strategies.</li>
        <li>Complete interview readiness blueprint.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>📝 ATS Optimized Resume</h3>
      <ul>
        <li>Generates an optimized professional summary.</li>
        <li>Tailors experience points to the target role.</li>
        <li>Dramatically improves ATS (Applicant Tracking System) compatibility.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🏗️ System Architecture

*The platform leverages a robust MERN stack integrated with Google's cutting-edge Gemini AI.*

```mermaid
graph TD;
    Client([User / Browser]) -->|Uploads PDF & JD| Frontend;
    
    subgraph Frontend [Frontend: React + Vite]
    UI[React Dashboard]
    Auth[Context API Auth]
    end

    Frontend -->|REST API Requests| Backend;

    subgraph Backend [Backend: Node.js + Express]
    Router[Express Routes]
    Middleware[Zod & Auth Middleware]
    PDF[PDF Parser & Multer]
    Prompt[Prompt Engineering Engine]
    
    Router --> Middleware
    Middleware --> PDF
    PDF --> Prompt
    end

    Backend <-->|Data Storage| DB[(MongoDB Atlas)];
    Prompt <-->|Prompt & Context| AI{Google Gemini 2.5 Flash};
    AI -->|Structured JSON Output| Backend;
