import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
} from "../controllers/user.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"

const router = express.Router();

// User registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// User logout
router.post("/logout", authMiddleware, logoutUser);

// User token refresh
router.post("/refresh-token", refreshAccessToken);

export default router;
