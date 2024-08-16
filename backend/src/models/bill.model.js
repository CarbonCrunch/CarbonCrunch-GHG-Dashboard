import mongoose, { Schema } from "mongoose";

const billSchema = new Schema(
  {
    billId: { type: String }, 
    billName: { type: String, required: true }, 
    username: { type: String },
    createdAt: { type: Date, default: Date.now },
    companyName: { type: String, required: true },
    facilityName: { type: String, required: true },
    data: { type: Object, default: {} }, 
    type_off_bill: { type: String },
    URL: { type: String },
  },
  { timestamps: true }
);

export const Bill =  mongoose.model("Bill", billSchema);
