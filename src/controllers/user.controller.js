import User from "../models/user.model";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/Apiresponse";
import asyncHandler from "../utils/asyncHandler";


// Cookie Option

const cookieOption = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
}

//New User Registeration
export const register = asyncHandler(async (req, res) => {
    const {name, email, rollNo, secton, department, year, subject, role} = req.body;

    if(!name || !email || !rollNo || !secton || !department || !year){
       throw new ApiError(400, "Please fill  the required fields fields");
    }
});

