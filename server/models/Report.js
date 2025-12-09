import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    reporterId: { type: String, required: true },
    reporterName: { type: String, required: true },
    targetEventId: { type: String, required: true },
    eventTitle: { type: String, required: true },
    reason: { 
      type: String, 
      enum: ["Spam", "Inappropriate", "Harassment", "Other"], 
      required: true 
    },
    status: { type: String, enum: ["pending", "resolved"], default: "pending" },
    notes: { type: String } // optional admin notes or resolution details
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", ReportSchema);
export default Report;
