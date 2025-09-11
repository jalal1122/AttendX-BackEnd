import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Cloudinary from "../utils/cloudinary.js"

// Cookie Option

const cookieOption = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

//New User Registeration
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email,password, department,} =
    req.body;

    console.log(req.body);

  if (!name || !email || !password || !department) {
    throw new ApiError(400, "Please fill the required fields fields");
  }

  console.log("first test passed");

  const existingUser = await User.findOne({ email }).select("-password -refreshToken");

  if (existingUser) {
    throw new ApiError(400, "The user is already exist");
  }

  const userData = {
    name,
    email,
    password,
    department,
  };

  if(req.file){
    const result = await Cloudinary(req.file.path)
    userData.profilePicture = result.secure_url
  }

  const newUser = await User.create(userData);

  const responseData = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    rollNo: newUser.rollNo,
    section: newUser.section,
    department: newUser.department,
    year: newUser.year,
    role: newUser.role,
    profilePicture: newUser.profilePicture,
  };

  res.status(201).json(new ApiResponse(201, "User registered successfully", responseData));
});

// User Login
export const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please fill the required fields");
    }

    const user = await user.findOne({email}).select("+password +refreshToken")

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const passwordValidation = await user.compare({password})

    if (!passwordValidation) {
        throw new ApiError(401, "Invalid password");
    }

    const accessToken = user.generateAccessToken()

    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken

    await user.save({validateModifiedOnly: true})

    res.status(200).json(new ApiResponse(200, "User logged in successfully", { 
        _id: user._id,
        name: user.name,
        email: user.email,
        rollNo: user.rollNo,
        section: user.section,
        department: user.department,
        year: user.year,
        role: user.role,
        accessToken,
        refreshToken
     }))
});

// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
    const {refreshToken} = req.body;

    res.cookie("accessToken", cookieOption)
    res.cookie("refreshToken", cookieOption)

    if(refreshToken){
        const user = await User.findOne({refreshToken});

         if(user){
        user.refreshToken = "";
        await user.save({validateModifiedOnly: true});
       }
    }

    res.status(200).json(new ApiResponse(200, "User logged out successfully"));
})

// Refreshing Access Token
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookie?.refreshToken || req.body.refreshToken

    console.log("Refreshing Access Token");

    if(!refreshToken){
        throw new ApiError(401, "Refresh token is required");
    }

    let decoded;
    try{
       decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    }catch(error){
        throw new ApiError(401, "Invalid refresh token");
    }

    const user = await User.findOne({_id: decoded.id, refreshToken})

    if(!user){
        throw new ApiError(404, "User not found");
    }
    
    const newAccessToken = user.generateAccessToken()

    res
      .status(200)
      .json(new ApiResponse(200, "Access token refreshed successfully", { 
        user: { 
            _id: user._id,
            name: user.name,
            email: user.email,
            rollNo: user.rollNo,
            section: user.section,
            department: user.department,
            year: user.year,
            role: user.role,
            accessToken: newAccessToken
        }
    }))
})


