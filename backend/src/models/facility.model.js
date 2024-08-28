import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";

// Define the enums for entities and actions
const ENTITY_ENUM = [
  "fuel",
  "bioenergy",
  "food",
  "refrigerants",
  "ehctd",
  "wttfuel",
  "material",
  "waste",
  "btls",
  "ec",
  "water",
  "fg",
  "homeOffice",
  "ownedVehicles",
  "fa",
  "Bill",
  "Role",
  "Facility",
];

const ACTIONS_ENUM = ["read", "create", "update", "delete", "manage"];

// Define the Facility schema
const facilitySchema = new Schema({
  facilityName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  facilityLocation: {
    type: String,
    required: true,
    trim: true,
  },
  userRoles: [
    {
      username: {
        type: String, // Store usernames directly
        required: true,
        trim: true,
        validate: {
          validator: function (v) {
            // This example assumes you have a way to check the user's role.
            // If you need to check this dynamically, ensure the logic can access the role context.
            if (["Admin", "FacAdmin", "Employee"].includes(this.role)) {
              return !!v; // username is required for Admin, FacAdmin, and Employee
            }
            return true; // username is optional for SuperUser
          },
          message: (props) => `${props.value} is required for specific roles`,
        },
      },
      fullAccess: {
        type: Boolean, // New field to indicate full access to all entities and actions
        default: false, // Default to false; set to true to grant full access
      },
      permissions: [
        {
          entity: {
            type: String,
            enum: ENTITY_ENUM,
            required: true,
          },
          actions: {
            type: [String], // Array of actions to allow multiple CRUD operations
            enum: ACTIONS_ENUM,
            required: true,
          },
        },
      ],
    },
  ],
});

// Pre-save middleware to populate permissions if fullAccess is true
facilitySchema.pre("save", function (next) {
  this.userRoles.forEach((userRole) => {
    if (userRole.fullAccess) {
      // Grant full permissions for "Role" and "Facility" entities, and limited permissions for other entities
      userRole.permissions = ENTITY_ENUM.map((entity) => {
        // Check if the entity is "Role" or "Facility"
        if (["Role", "Facility"].includes(entity)) {
          return {
            entity,
            actions: ACTIONS_ENUM, // Grant all actions, including "manage"
          };
        } else {
          return {
            entity,
            actions: ACTIONS_ENUM.filter(action => action !== "manage"), // Grant all actions except "manage"
          };
        }
      });
    }
  });
  next();
});


// Post-save middleware to update User model based on updated userRoles in Facility
facilitySchema.post("save", async function (doc, next) {
  try {
    const userUpdates = doc.userRoles.map(async (userRole) => {
      const username = userRole.username;

      // Find the user by username and add the facility ID if it's not already included
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { facilities: doc._id } } // $addToSet ensures no duplicates
      );

      return user;
    });

    // Wait for all user updates to complete
    await Promise.all(userUpdates);
    next();
  } catch (error) {
    next(error);
  }
});


export const Facility = mongoose.model("Facility", facilitySchema);
