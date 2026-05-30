const express = require("express");

const interviewRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");

const interviewController = require("../controllers/interview.controller");

/**
 * Generate Interview Report
 * POST /api/interview
 */
interviewRouter.post(
  "/",
  authMiddleware.authUser,
  upload.single("resume"),
  interviewController.generateInterviewReportController,
);

/**
 * Get All Interview Reports
 * GET /api/interview
 */
interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportsController,
);

/**
 * Get Single Interview Report
 * GET /api/interview/report/:interviewId
 */
interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController,
);

/**
 * Generate Resume PDF
 * POST /api/interview/resume/pdf/:interviewId
 */
interviewRouter.post(
  "/resume/pdf/:interviewId",
  authMiddleware.authUser,
  interviewController.generateResumePdfController,
);

/**
 * Delete Interview Report
 * DELETE /api/interview/:interviewId
 */
interviewRouter.delete(
  "/:interviewId",
  authMiddleware.authUser,
  interviewController.deleteInterviewReportController,
);

module.exports = interviewRouter;
