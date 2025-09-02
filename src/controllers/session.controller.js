import Session from "../models/Session.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// create a new Session
export const createSession = asyncHandler(async (req, res, next) => {
  // get the class id from req body
  const { classId } = req.body;

  // get the teacher Id from the req user
  const teacherId = req.user._id;

  // check if there is an active session for the class
  const activeSession = await Session.findOne({
    classId,
    teacherId,
    isActive: true,
  });
  if (activeSession) {
    throw new ApiError(
      400,
      "There is already an active session for this class"
    );
  }

  // create a new session
  const newSession = new Session({
    classId,
    teacherId,
  });

  //   save the session
  await newSession.save();

  //   respond with the created session
  res
    .status(201)
    .json(new ApiResponse(201, "Session created successfully", newSession));
});

// get the active Session by class ID
export const getActiveSessionByClassId = asyncHandler(
  async (req, res, next) => {
    // get the class id from req params
    const { classId } = req.params;

    // get the teacher Id from the req user
    const teacherId = req.user._id;

    // find the active session for the class
    const activeSession = await Session.findOne({
      classId,
      teacherId,
      isActive: true,
    });

    // check if session exists
    if (!activeSession) {
      throw new ApiError(404, "No active session found for this class");
    }

    // respond with the active session
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Active session fetched successfully",
          activeSession
        )
      );
  }
);

// end the session
export const endSession = asyncHandler(async (req, res, next) => {
  // get the teacher Id from the req user
  const teacherId = req.user._id;

  //   get the class ID from params
  const { classId } = req.params;

  // find the active session for the class
  const activeSession = await Session.findOne({
    classId,
    teacherId,
    isActive: true,
  });

  // check if session exists
  if (!activeSession) {
    throw new ApiError(404, "No active session found for this class");
  }

  // end the session
  activeSession.isActive = false;
  activeSession.endedAt = new Date();
  await activeSession.save();

  // respond with the ended session
  res
    .status(200)
    .json(new ApiResponse(200, "Session ended successfully", activeSession));
});
