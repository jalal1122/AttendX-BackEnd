import express from "express";
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
  handleValidationErrors,
} from "../middleware/validate.middleware.js";

const userRouter = express.Router();

// User registration
userRouter.post("/register", validateUserRegistration, handleValidationErrors, registerUser);

// User login
userRouter.post("/login", validateUserLogin, handleValidationErrors, loginUser);

// User logout
userRouter.post("/logout", authMiddleware, logoutUser);

// User token refresh
userRouter.post("/refresh-token", refreshAccessToken);

export default userRouter;
