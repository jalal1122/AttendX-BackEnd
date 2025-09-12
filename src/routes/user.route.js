import express from "express";
import multer from "multer";
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

// Configure multer for single image upload (in-memory or disk). Using disk storage temp folder.
const upload = multer({ dest: "temp/" });

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
