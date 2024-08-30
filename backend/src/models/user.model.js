

// userModel.js
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the User schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      trim: true,
      sparse: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          if (["SuperUser"].includes(this.role)) {
            return !!v; // email is required for SuperUser
          }
          return true; // email is optional for other roles
        },
        message: (props) => `${props.value} is required for role ${props.path}`,
      },
    },
    companyName: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (["Admin", "FacAdmin", "Employee"].includes(this.role)) {
            return !!v; // companyName is required for Admin, FacAdmin, and Employee
          }
          return true; // companyName is optional for SuperUser
        },
        message: (props) => `${props.value} is required for role ${props.path}`,
      },
    },
    role: {
      type: String,
      enum: ["SuperUser", "Admin", "FacAdmin", "Employee"],
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      trim: true,
    },
    facilities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Facility", // Reference to Facility schema directly
      },
    ],
    refreshToken: {
      type: String,
    },
    reports: [
      {
        type: Schema.Types.ObjectId,
        ref: "Report",
      },
    ],
    bills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bill",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Password hashing and token generation methods remain the same

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    return next(err);
  }
});

// Pre-hook to propagate photo to other users with the same companyName
userSchema.post("save", async function (next) {
  if (this.photo && this.isModified("photo")) {
    try {
      await mongoose.model("User").updateMany(
        {
          companyName: this.companyName,
          photo: { $exists: false }, // Only update users who don't have a photo
        },
        {
          $set: { photo: this.photo },
        }
      );
    } catch (err) {
      return next(err);
    }
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Pre-hook to populate facilities on every find query
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "facilities",
    // select: "-__v", // Exclude specific fields if needed
  });

  next();
});

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

export const User = mongoose.model("User", userSchema);
