import { config } from "dotenv";
config();

import app from "../src/app.js";
import connectDB from "../src/configs/db.config.js";

let dbReady;

export default async function handler(req, res) {
  if (!dbReady) {
    dbReady = connectDB();
  }
  await dbReady;
  return app(req, res);
}
