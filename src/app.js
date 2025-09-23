import express from "express";
import userRouter from "./routes/user.route.js";
import attendanceRouter from "./routes/attendance.route.js";
import classRouter from "./routes/class.route.js";
import sessionRouter from "./routes/session.route.js";
import cookieparser from "cookie-parser";
import cors from "cors";
import ApiError from "./utils/ApiError.js";
import ApiResponse from "./utils/ApiResponse.js";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// adding middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

// *** ROUTERS *** //

// User Router
app.use("/api/user", userRouter);

// Attendance Router
app.use("/api/attendance", attendanceRouter);

// Class Router
app.use("/api/class", classRouter);

// Session Router
app.use("/api/session", sessionRouter);

// Validation error handler (after routes)
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res
      .status(err.statusCode || 500)
      .json(new ApiResponse(err.statusCode || 500, err.message, err.error));
  }
  console.error("Unhandled Error:", err);
  return res
    .status(500)
    .json(new ApiResponse(500, "Internal Server Error", err?.message));
});

export default app;
