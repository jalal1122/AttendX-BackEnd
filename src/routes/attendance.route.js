import express from "express";
import {
  generateQrToken,
  markAttendance,
  getAllSessions,
  getAttendanceBySessionId,
  getAttendanceByStudentId,
} from "../controllers/attendance.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

// Attendance Router
const attendanceRouter = express.Router();

// @desc Get all sessions
// @route GET /api/attendance/sessions
// @access Public
attendanceRouter.get("/sessions", getAllSessions);

// @desc Get attendance by session Id
// @route GET /api/attendance/session/:sessionId
// @access Public
attendanceRouter.get("/:sessionId", getAttendanceBySessionId);

// @desc Get attendance by student Id
// @route GET /api/attendance/student/:studentId
// @access Public
attendanceRouter.get("/:studentId", getAttendanceByStudentId);

// @desc Generate QR token
// @route POST /api/attendance/generate-qr-token
// @access Private
attendanceRouter.post("/generate-qr-token", authMiddleware, generateQrToken);

// @desc Mark attendance
// @route POST /api/attendance/mark-attendance
// @access Private
attendanceRouter.post("/mark-attendance", authMiddleware, markAttendance);

export default attendanceRouter;
