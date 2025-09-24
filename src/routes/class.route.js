import express from "express";
import {
  deleteClass,
  joinClass,
  getClassByName,
  getClassByCode,
  getClassById,
  getClasses,
  createClass,
} from "../controllers/class.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

// Class Router
const classRouter = express.Router();

// @desc Get all classes for logged-in teacher
// @route GET /api/class/
// @access Private
classRouter.get("/", authMiddleware, getClasses);

// @desc Get class by ID
// @route GET /api/class/id/:classId
// @access Public
classRouter.get("/id/:classId", getClassById);

// @desc Get class by code
// @route GET /api/class/code/:classCode
// @access Public
classRouter.get("/code/:classCode", getClassByCode);

// @desc Get class by name
// @route GET /api/class/name/:className
// @access Public
classRouter.get("/name/:className", getClassByName);

// @desc Create a new class
// @route POST /api/class/create
// @access Private
classRouter.post("/create", authMiddleware, createClass);

// @desc Join a class
// @route POST /api/class/join/:classId
// @access Private
classRouter.post("/join/:classId", authMiddleware, joinClass);

// @desc Delete a class
// @route DELETE /api/class/:classId
// @access Private
classRouter.delete("/:classId", authMiddleware, deleteClass);

export default classRouter;
