import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
} from "../controllers/user.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"

const userRouter = express.Router();

// User registration
userRouter.post("/register", registerUser);

// User login
userRouter.post("/login", loginUser);

// User logout
userRouter.post("/logout", authMiddleware, logoutUser);

// User token refresh
userRouter.post("/refresh-token", refreshAccessToken);

export default userRouter;
 