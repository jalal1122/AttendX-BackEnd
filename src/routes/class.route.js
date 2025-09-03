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

// @desc Get all classes
// @route GET /api/classes
// @access Public
classRouter.get("/", getClasses);

// @desc Get class by ID
// @route GET /api/classes/:id
// @access Public
classRouter.get("/:id", getClassById);

// @desc Get class by code
// @route GET /api/classes/code/:code
// @access Public
classRouter.get("/:code", getClassByCode);

// @desc Get class by name
// @route GET /api/classes/name/:name
// @access Public
classRouter.get("/:name", getClassByName);

// @desc Create a new class
// @route POST /api/classes
// @access Private
classRouter.post("/create", authMiddleware, createClass);

// @desc Join a class
// @route POST /api/classes/join
// @access Private
classRouter.post("/join", authMiddleware, joinClass);

// @desc Delete a class
// @route DELETE /api/classes/:id
// @access Private
classRouter.delete("/delete/:id", authMiddleware, deleteClass);

export default classRouter;
