import mongoose from "mongoose";

const LogSchema = new mongoose.Schema(
  {
    adminId: { type: String, required: true },
    adminName: { type: String, required: true },
    action: { 
      type: String, 
      required: true,
      enum: ["CREATE_USER", "DELETE_USER", "UPDATE_USER", "SEND_BROADCAST", "CREATE_EVENT", "DELETE_EVENT"]
    },
    target: {
      type: {
        entity: String, // e.g., "User", "Event"
        id: String,     // e.g., "12345"
      },
      default: null
    },
    details: { type: String, default: "" },
    meta: { type: mongoose.Schema.Types.Mixed } // store any extra info
  },
  { timestamps: true }
);

const Log = mongoose.model("Log", LogSchema);
export default Log;
