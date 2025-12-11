import express from "express";
import { 
  getAdminStats, 
  getAllEvents, 
  sendBroadcast, 
  createReport, 
  getReports, 
  resolveReport, 
  getSystemLogs, 
  getTransactions 
} from "../controllers/admin.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", verifyToken, getAdminStats);
router.get("/events", verifyToken, getAllEvents);
router.post("/broadcast", verifyToken, sendBroadcast);

router.post("/report", verifyToken, createReport);
router.get("/reports", verifyToken, getReports);
router.patch("/reports/:id", verifyToken, resolveReport);

router.get("/logs", verifyToken, getSystemLogs);

router.get("/transactions", verifyToken, getTransactions);

export default router;
