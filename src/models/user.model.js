import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// User schema definition
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
  password: {
    type: String,
    required: true,
  },
  rollNo: {
    type: Number,
  },
  department: {
    type: String,
    required: true,
  },
  section: {
    type: String,

  },
  subject: {
    type: [String],
    default: [],
  },
  year: {
    type: Number,
  },
  deviceIds: {
    type: [String],
    default: [],
  },
  refreshToken: {
    type: String,
    default: null,
  },
});

// hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // generate salt
  const salt = await bcryptjs.genSalt(10);

  // generate password Hash
  this.password = await bcryptjs.hash(this.password, salt);

  // move to next function
  next();
});

// Method to generate Access token
userSchema.methods.generateAccessToken = function () {
  const token = jwt.sign(
    { id: this._id, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return token;
};

// Method to generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  const token = jwt.sign(
    { id: this._id, email: this.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
  return token;
};

// Method to verify the password
userSchema.methods.verifyPassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

// Adding the User Schema to the model
const User = mongoose.model("User", userSchema);

export default User;
