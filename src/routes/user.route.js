import express from "express";
import multer from "multer";
import os from "os";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  validateUserRegistration,
  validateUserLogin,
} from "../middleware/validate.middleware.js";

const userRouter = express.Router();

// Configure multer to write to OS temp dir (works on Vercel serverless: /tmp)
const upload = multer({
  dest: process.env.NODE_ENV === "production" ? os.tmpdir() : "temp/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
});

// User registration
userRouter.post(
  "/register",
  upload.single("profilePicture"),
  validateUserRegistration,
  registerUser
);

// User login
userRouter.post("/login", validateUserLogin, loginUser);

// User logout
userRouter.post("/logout", authMiddleware, logoutUser);

// User token refresh
userRouter.post("/refresh-token", refreshAccessToken);

export default userRouter;
