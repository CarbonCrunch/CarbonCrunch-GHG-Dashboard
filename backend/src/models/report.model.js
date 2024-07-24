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
      start: { type: Date,},
      end: { type: Date },
    },
    fuel: { type: Object },
    food: { type: Object },
    bioenergy: { type: Object },
    refrigerants: { type: Object },
    ehctd: { type: Object, default: { total: "20" } },
    wttfuels: { type: Object },
    material: { type: Object },
    waste: { type: Object },
    btls: { type: Object },
    ec: { type: Object },
    water: { type: Object },
    fg: { type: Object },
    homeOffice: { type: Object },
    ov: { type: Object },
    fa: { type: Object },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model("Report", reportSchema);
