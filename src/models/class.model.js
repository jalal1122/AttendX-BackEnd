import mongoose from "mongoose";

// Class schema definition
const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
    },
    code: {
      type: String,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Method to generate class code
classSchema.methods.generateClassCode = function () {
  // take first 3 letters from class name
  const prefix = this.className.substring(0, 3).toUpperCase();

  // generate random 4-digit alphanumeric string
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `${prefix}-${randomPart}`;
};

// Pre-save hook to assign code if not already set
classSchema.pre("save", function (next) {
  if (!this.classCode) {
    this.classCode = this.generateClassCode();
  }
  next();
});

// Class model
const Class = mongoose.model("Class", classSchema);

export default Class;
