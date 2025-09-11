import { v2 as cloudinary } from "cloudinary";
import ApiError from "./ApiError.js";
import asyncHandler from "./asyncHandler.js";

// upload the file to cloudinary
export const uploadOnCloudinary = asyncHandler(async (filePath) => {
  // check the file path
  if (!filePath) {
    throw new ApiError(400, "No file uploaded");
  }

  // cloudinary configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // upload the file to cloudinary
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "auto",
    folder: "StallionWear",
    quality: "auto",
    fetch_format: "auto",
  });

  //   check the result
  if (!result || !result.secure_url) {
    throw new ApiError(500, "Error uploading file to Cloudinary");
  }

  return result.secure_url;
});

export default cloudinary;
