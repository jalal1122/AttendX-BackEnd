import express from "express";
import {
  createSession,
  getActiveSessionByClassId,
  endSession,
} from "../controllers/session.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

// Session Router
const sessionRouter = express.Router();

// Create a new session
sessionRouter.post("/create", authMiddleware, createSession);

// Get active session by class ID
sessionRouter.get(
  "/active/:classId",
  authMiddleware,
  getActiveSessionByClassId
);

// End a session
sessionRouter.delete("/end/:classId", authMiddleware, endSession);

export default sessionRouter;
