// roleModel.js
import mongoose, { Schema } from "mongoose";

// Define the Role schema
const roleSchema = new Schema({
  roleName: {
    type: String,
    enum: ["SuperUser", "Admin", "FacAdmin", "Employee"],
    required: true,
    trim: true,
  },
  permissions: [
    {
      type: String,
      enum: ["CRUD", "Role Creation", "Facility Creation"], // Permission levels
      required: true,
    },
  ],
});

export const Role = mongoose.model("Role", roleSchema);
