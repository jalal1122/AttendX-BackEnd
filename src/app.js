import express from "express";
import userRouter from './routes/user.route.js'

const app = express();

// adding middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// adding the routers
app.use("/api/user", userRouter);

export default app;
