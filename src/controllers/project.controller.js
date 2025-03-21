import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Project } from "../models/project.model.js";
import mongoose from "mongoose"; // Ensure mongoose is imported
import { User } from "../models/user.model.js";

const projectDetail = asyncHandler(async (req, res) => {
  const { name, host, description, department, members } = req.body;

  // Validate required fields
  if (!name || !host || !description || !department || !members) {
    throw new ApiError(400, "All fields are required");
  }

  const project = await Project.create({
    name,
    host,
    description,
    department,
    members,
  });

  if (!project) {
    throw new ApiError(500, "Something went wrong while adding the project");
  }

  return res.status(201).json(
    new ApiResponse(201, { project }, "Project added successfully")
  );
});

export { projectDetail };
