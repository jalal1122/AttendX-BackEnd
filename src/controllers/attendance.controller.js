import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Attendance from "../models/attendance.model.js";
import jwt from "jsonwebtoken";
import Session from "../models/session.model.js";

// generate Qr Code Token
export const generateQrToken = asyncHandler(async (req, res, next) => {
  // get the session Id from req body
  const { sessionId, classId } = req.body;

  // generate a QR code token
  const qrToken = jwt.sign({ sessionId, classId }, process.env.QR_SECRET, {
    expiresIn: process.env.QR_EXPIRY || "30s",
  });

  // respond with the QR code token
  res
    .status(200)
    .json(
      new ApiResponse(200, "QR code token generated successfully", { qrToken })
    );
});

// mark the attendance
export const markAttendance = asyncHandler(async (req, res, next) => {
  // get the session Id from req body
  const { sessionId, classId, qrToken } = req.body;

  // get the student Id from req user
  const studentId = req.user._id;

  // verify the QR code token
  const decodedQr = jwt.verify(qrToken, process.env.QR_SECRET);

  // check if the decoded QR token matches the session and class Id
  if (
    !decodedQr ||
    decodedQr.sessionId !== sessionId ||
    decodedQr.classId !== classId
  ) {
    return next(new ApiError(401, "Invalid QR code token or Token Expired"));
  }

  // check if attendance already exists
  const existingAttendance = await Attendance.findOne({ sessionId, studentId });
  if (existingAttendance) {
    throw new ApiError(400, "Attendance already marked for this session");
  }

  // create a new attendance record
  const newAttendance = new Attendance({
    sessionId,
    studentId,
    status: "present",
  });

  // save the attendance record
  await newAttendance.save();

  // respond with the created attendance record
  res
    .status(201)
    .json(
      new ApiResponse(201, "Attendance marked successfully", newAttendance)
    );
});

// get all Sessions
export const getAllSessions = asyncHandler(async (req, res, next) => {
  // find all sessions
  const sessions = await Session.find();

  const populatedSessions = await Session.populate(sessions, "sessionId");
  populatedSessions = await Session.populate(populatedSessions, "classId");

  // respond with the sessions
  res
    .status(200)
    .json(
      new ApiResponse(200, "Sessions retrieved successfully", populatedSessions)
    );
});

// get attendance by session Id
export const getAttendanceBySessionId = asyncHandler(async (req, res, next) => {
  // get the session Id from the params
  const { sessionId } = req.params;

  // find attendance records by session Id
  const attendanceRecords = await Attendance.find({ sessionId });

  // respond with the attendance records
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Attendance records retrieved successfully",
        attendanceRecords
      )
    );
});

// get the attendance by student Id
export const getAttendanceByStudentId = asyncHandler(async (req, res, next) => {
  // get the student Id from the params
  const { studentId } = req.params;

  // find attendance records by student Id
  const attendanceRecords = await Attendance.find({ studentId });

  // respond with the attendance records
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Attendance records retrieved successfully",
        attendanceRecords
      )
    );
});
