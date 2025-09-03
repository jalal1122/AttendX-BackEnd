import app from "./app.js";
import { config } from "dotenv";
import connectDB from "./configs/db.config.js";

config();

app.listen(process.env.PORT || 5000, async () => {
  await connectDB();
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
