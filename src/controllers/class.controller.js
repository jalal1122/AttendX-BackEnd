import Class from "../models/class.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

// Create a new Class
export const createClass = asyncHandler(async (req, res) => {
  // get the class name and teacher id from the req body
  const { className } = req.body;

  // get the teacher id from the req user
  const teacherId = req.user._id;

  // check for the existence of the teacher
  const teacher = await User.findById(teacherId);
  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  // check for the existence of the class
  const existingClass = await Class.findOne({ className, teacher: teacherId });
  if (existingClass) {
    throw new ApiError(400, "Class already exists");
  }

  // check if the role is teacher
  if (teacher.role !== "teacher") {
    throw new ApiError(403, "Only teachers can create classes");
  }

  // Validate request body
  if (!className || !teacherId) {
    throw new ApiError(400, "Class name and teacher ID are required");
  }

  //   create a new class
  const newClass = new Class({
    className,
    teacher: teacherId, 
  });

  //   save the new class
  await newClass.save();

  //   respond with the created class
  res
    .status(201)
    .json(new ApiResponse(201, "Class created successfully", newClass));
});

// Get All Classes for the respective login teacher
export const getClasses = asyncHandler(async (req, res) => {
  console.log("Get Classes called");

  // get the teacher id from the req user
  const teacherId = req.user._id;

  //   find all classes taught by the teacher
  const classes = await Class.find({ teacher: teacherId });

  console.log(classes);
  

  //   populate the teacher and students fields
  await Promise.all(
    classes.map(async (classItem) => {
      await classItem.populate("teacher");
      await classItem.populate("students");
    })
  );

  //   respond with populated classes
  res
    .status(200)
    .json(new ApiResponse(200, "Classes fetched successfully", classes));
});

// Get a Class by ID
export const getClassById = asyncHandler(async (req, res) => {
  // get the class id from the req params
  const { classId } = req.params;

  //   find the class by id
  const searchedClass = await Class.findById(classId);

  //   check if class exists
  if (!searchedClass) {
    throw new ApiError(404, "Class not found");
  }

  //   populate the teacher and students fields
  const populatedClass = await searchedClass.populate("teacher");
  populatedClass.populate("students");

  //   respond with the populated class
  res
    .status(200)
    .json(new ApiResponse(200, "Class fetched successfully", populatedClass));
});

// get a class by class Code
export const getClassByCode = asyncHandler(async (req, res) => {
  // get the class code from the req params
  const { classCode } = req.params;

  //   find the class by code
  const searchedClass = await Class.find({
    classCode: { $regex: classCode, $options: "i" },
  });

  //   check if class exists
  if (!searchedClass) {
    throw new ApiError(404, "Class not found");
  }

  //   populate the teacher and students fields
  const populatedClass = await searchedClass.populate("teacher");
  populatedClass.populate("students");

  //   respond with the populated class
  res
    .status(200)
    .json(new ApiResponse(200, "Class fetched successfully", populatedClass));
});

// get a class by class Name
export const getClassByName = asyncHandler(async (req, res) => {
  // get the class name from the req params
  const { className } = req.params;

  //   find the class by name
  const searchedClass = await Class.findOne({
    className: { $regex: className, $options: "i" },
  });

  //   check if class exists
  if (!searchedClass) {
    throw new ApiError(404, "Class not found");
  }

  //   populate the teacher and students fields
  const populatedClass = await searchedClass.populate("teacher");
  populatedClass.populate("students");

  //   respond with the populated class
  res
    .status(200)
    .json(new ApiResponse(200, "Class fetched successfully", populatedClass));
});

// join a class(for Students)
export const joinClass = asyncHandler(async (req, res) => {
  // get the class id from the req params
  const { classId } = req.params;

  //   get the student id from the req user
  const studentId = req.user._id;

  // check if user is existing or not and is a student
  const student = await User.findById(studentId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }
  if (student.role !== "student") {
    throw new ApiError(403, "Only students can join classes");
  }

  //   find the class to join
  const classToJoin = await Class.findById(classId);

  //   check if class exists
  if (!classToJoin) {
    throw new ApiError(404, "Class not found");
  }

  // check if student is already enrolled
  if (classToJoin.checkIfStudentEnrolled(studentId)) {
    throw new ApiError(400, "Already enrolled in this class");
  }

  // enroll the student
  classToJoin.students.push(studentId);
  await classToJoin.save();

  //   respond with the updated class
  res
    .status(200)
    .json(new ApiResponse(200, "Joined class successfully", classToJoin));
});

// delete a class by ID
export const deleteClass = asyncHandler(async (req, res) => {
  // get the class Id from the req body
  const { classId } = req.params;

  // check if user is a teacher
  const teacher = await User.findById(req.user._id);
  if (teacher.role !== "teacher") {
    throw new ApiError(403, "Only teachers can delete classes");
  }

  // find the class by id
  const classToDelete = await Class.findById(classId);

  // check if class exists
  if (!classToDelete) {
    throw new ApiError(404, "Class not found");
  }

  // find the class by id and delete
  const deletedClass = await Class.findByIdAndDelete(classId);

  // respond with the deleted class
  res
    .status(200)
    .json(new ApiResponse(200, "Class deleted successfully", deletedClass));
});
