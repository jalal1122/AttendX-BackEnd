import express from "express";
import userRouter from './routes/user.route.js'
import attendanceRouter from "./routes/attendance.route.js";
import classRouter from "./routes/class.route.js";
import sessionRouter from "./routes/session.route.js";

const app = express();

// adding middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// *** ROUTERS *** //

// User Router
app.use("/api/user", userRouter);

// Attendance Router
app.use("/api/attendance", attendanceRouter);

// Class Router
app.use("/api/class", classRouter);

// Session Router
app.use("/api/session", sessionRouter);

export default app;
