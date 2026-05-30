const pdfParse = require("pdf-parse");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const { generateInterviewReport } = require("../services/ai.service");
const InterviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    const { selfDescription, jobDescription } = req.body;

    if (!selfDescription || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "selfDescription and jobDescription are required",
      });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const resumeContent = pdfData.text;

    const interviewReportByAi = await generateInterviewReport(
      resumeContent,
      selfDescription,
      jobDescription,
    );

    const reportTitle =
      interviewReportByAi.title ||
      `Interview Strategy - ${new Date().toLocaleDateString()}`;

    const interviewReport = await InterviewReportModel.create({
      user: req.user.id,
      title: reportTitle,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    });

    return res.status(201).json({
      success: true,
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("Error generating interview report:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate interview report",
      error: error.message,
    });
  }
}

async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Interview ID format",
      });
    }

    const interviewReport = await InterviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found",
      });
    }

    return res.status(200).json({
      success: true,
      interviewReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview report",
      error: error.message,
    });
  }
}

async function getAllInterviewReportsController(req, res) {
  try {
    const reports = await InterviewReportModel.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
      );

    return res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
}

async function deleteInterviewReportController(req, res) {
  try {
    const { interviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Interview ID format",
      });
    }

    const deletedReport = await InterviewReportModel.findOneAndDelete({
      _id: interviewId,
      user: req.user.id,
    });

    if (!deletedReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview report deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete report",
      error: error.message,
    });
  }
}

/**
 * Generate Professional PDF Resume
 */
async function generateResumePdfController(req, res) {
  try {
    const { interviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Interview ID format" });
    }

    const report = await InterviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!report || !report.optimizedResume) {
      return res
        .status(404)
        .json({ success: false, message: "Optimized resume not found" });
    }

    const resume = report.optimizedResume;
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${resume.name.replace(/\s+/g, "_")}_Resume.pdf`,
    );

    doc.pipe(res);

    // --- Helper function for section headers ---
    const drawSectionHeader = (title) => {
      doc.moveDown(1);
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#333333")
        .text(title.toUpperCase());

      // Draw a sleek line under the header
      const y = doc.y + 2;
      doc
        .moveTo(50, y)
        .lineTo(545, y)
        .lineWidth(1)
        .strokeColor("#cccccc")
        .stroke();
      doc.moveDown(0.5);
    };

    // 1. HEADER (Name & Contact)
    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor("#000000")
      .text(resume.name, { align: "center" });
    doc.moveDown(0.2);
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#555555")
      .text(resume.contactInfo, { align: "center" });

    // 2. SUMMARY
    if (resume.summary) {
      drawSectionHeader("Professional Summary");
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#000000")
        .text(resume.summary, { lineGap: 3 });
    }

    // 3. SKILLS
    if (resume.skills) {
      drawSectionHeader("Technical Skills");
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#000000")
        .text(resume.skills, { lineGap: 3 });
    }

    // 4. EXPERIENCE
    if (resume.experience && resume.experience.length > 0) {
      drawSectionHeader("Experience");

      resume.experience.forEach((job) => {
        // Job Title & Duration on same line
        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor("#000000")
          .text(job.title, { continued: true });
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor("#555555")
          .text(`  |  ${job.duration}`, { align: "right" });

        // Company
        doc
          .font("Helvetica-Oblique")
          .fontSize(10)
          .fillColor("#333333")
          .text(job.company);
        doc.moveDown(0.3);

        // Achievements (Bullet points)
        doc.font("Helvetica").fontSize(10).fillColor("#000000");
        job.achievements.forEach((bullet) => {
          doc.text(`•  ${bullet}`, {
            indent: 15,
            lineGap: 2,
            align: "justify",
          });
        });
        doc.moveDown(0.5);
      });
    }

    // 5. EDUCATION
    if (resume.education && resume.education.length > 0) {
      drawSectionHeader("Education");

      resume.education.forEach((edu) => {
        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor("#000000")
          .text(edu.degree, { continued: true });
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor("#555555")
          .text(`  |  ${edu.year}`, { align: "right" });
        doc
          .font("Helvetica-Oblique")
          .fontSize(10)
          .fillColor("#333333")
          .text(edu.institution);
        doc.moveDown(0.3);
      });
    }

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to generate PDF" });
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  deleteInterviewReportController,
  generateResumePdfController,
};
