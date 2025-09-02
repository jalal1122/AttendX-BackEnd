import mongoose from "mongoose";

// Attendance schema
const attendanceSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent"],
      default: "",
    },
  },
  { timestamps: true }
);

// Attendance Model
const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
