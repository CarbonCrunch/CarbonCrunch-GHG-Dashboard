// facilityModel.js
import mongoose, { Schema } from "mongoose";

// Define the Facility schema
const facilitySchema = new Schema({
  facilityName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  facilityLocation: {
    type: String,
    required: true,
    trim: true,
  },
  userRoles: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to User schema
        required: true,
      },
      role: {
        type: Schema.Types.ObjectId,
        ref: "Role", // Reference to Role schema
        required: true,
      },
      permissions: [
        {
          type: String,
          enum: ["CRUD", "Role Creation", "Facility Creation"], // Permission levels
          required: true,
        },
      ],
    },
  ],
});

export const Facility = mongoose.model("Facility", facilitySchema);
