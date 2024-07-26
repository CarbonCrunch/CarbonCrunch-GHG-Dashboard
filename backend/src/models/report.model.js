import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
  {
    reportId: { type: String },
    reportName: { type: String, required: true },
    username: { type: String },
    createdAt: { type: Date, default: Date.now },
    companyName: { type: String, required: true },
    facilityName: { type: String, required: true },
    timePeriod: {
      type: {
        type: String,
        enum: ["monthly", "quarterly", "yearly", "custom"],
        required: true,
      },
      start: { type: Date },
      end: { type: Date },
    },
    fuel: {
      type: Object,
      default: {},
    },
    bioenergy: {
      type: Object,
      default: {},
    },
    food: { type: Object, default: {} },
    refrigerants: {
      type: Object,
      default: {},
    },
    ehctd: {
      type: Object,
      default: {},
    },
    wttfuels: { type: Object, default: {} },
    material: { type: Object, default: {} },
    waste: { type: Object, default: {} },
    btls: { type: Object, default: {} },
    ec: { type: Object, default: {} },
    water: { type: Object, default: {} },
    fg: { type: Object, default: {} },
    homeOffice: { type: Object, default: {} },
    ownedVehicles: {
      type: Object,
      default: {},
    },
    fa: { type: Object, default: {} },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model("Report", reportSchema);
