import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
} from "../services/interview.api";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { InterviewContext } from "../interview.context";
export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  const { loading, setLoading, report, setReport, reports, setReports } =
    context;
  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    let response = null;
    try {
      response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      if (response?.interviewReport) {
        setReport(response.interviewReport);
      }
    } catch (error) {
      console.error("Generate Report Error:", error);
    } finally {
      setLoading(false);
    }
    return response?.interviewReport;
  };
  const getReportById = async (interviewId) => {
    setLoading(true);
    let response = null;
    try {
      response = await getInterviewReportById(interviewId);
      if (response?.interviewReport) {
        setReport(response.interviewReport);
      }
    } catch (error) {
      console.error("Get Report Error:", error);
    } finally {
      setLoading(false);
    }
    return response?.interviewReport;
  };
  const getReports = async () => {
    setLoading(true);
    let response = null;
    try {
      response = await getAllInterviewReports();
      if (response?.interviewReports) {
        setReports(response.interviewReports);
      }
    } catch (error) {
      console.error("Get Reports Error:", error);
    } finally {
      setLoading(false);
    }
    return response?.interviewReports;
  };
  const getResumePdf = async (interviewReportId) => {
    setLoading(true);
    try {
      const response = await generateResumePdf({
        interviewReportId,
      });
      const blob = new Blob([response], {
        type: "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `resume_${interviewReportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Download Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);
  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
  };
};
