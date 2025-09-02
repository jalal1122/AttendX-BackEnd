import User from "../models/user.model";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

const authMiddleware = asyncHandler(async (req, res, next) => {

    const token = req.header.authorization?.split(" ")[1] || req.cookies.accessToken

    if(!token){
        throw new ApiError(401, "No token found");
    }

    let decoded;
    try{
       decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    }catch(error){
        throw new ApiError(401, "Invalid token");
    }

    const user = await User.findOne({_id: decoded.id, refreshToken: token})

    if(!user){
        throw new ApiError(404, "User not found");
    }

    req.user = user;
    next();
})

export default authMiddleware;