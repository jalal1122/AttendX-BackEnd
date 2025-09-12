import { body, validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    console.log("Validation errors:", errorMessages);
    throw new ApiError(400, errorMessages.join(", "));
  }
  next();
};

export const validateUserRegistration = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 }, { max: 50 })
    .withMessage("Name must be between 2 and 50 characters long")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("Name must contain only letters and spaces"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .withMessage(
      "Password must contain at least one letter, one number, and one special character"
    ),
  body("department").notEmpty().withMessage("Department is required"),

  // profilePicture is optional at validation layer; multer handles file parsing.
  // If you want to enforce required, uncomment below and ensure client sends multipart/form-data.
  // body("profilePicture").custom((value, { req }) => {
  //   if (!req.file) {
  //     throw new ApiError(400, "Profile picture is required");
  //   }
  //   return true;
  // }),

  handleValidationErrors,
];

export const validateUserLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .withMessage(
      "Password must contain at least one letter, one number, and one special character"
    ),
  handleValidationErrors,
];

export default {
  validateUserRegistration,
  validateUserLogin,
};
