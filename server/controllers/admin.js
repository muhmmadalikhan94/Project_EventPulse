import User from "../models/User.js";
import Event from "../models/Event.js";
import Notification from "../models/Notification.js";
import Report from "../models/Report.js";
import Log from "../models/Log.js";
import Transaction from "../models/Transaction.js";
import { createLog } from "../utils/logger.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    
    const events = await Event.find();
    
    const totalRSVPs = events.reduce((acc, curr) => acc + curr.participants.length, 0);
    
    const totalRevenue = events.reduce((acc, curr) => acc + (curr.price || 0) * curr.participants.length, 0);

    const categoryMap = {};
    events.forEach(e => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + 1;
    });
    const categoryData = Object.keys(categoryMap).map(key => ({
      name: key,
      value: categoryMap[key]
    }));

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("-password");
    const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      totalUsers,
      totalEvents,
      totalRSVPs,
      totalRevenue,
      categoryData,
      recentUsers,
      recentEvents
    });

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const sendBroadcast = async (req, res) => {
  try {
    const { message, title } = req.body;
    const users = await User.find();

    const notifications = users.map(user => ({
      userId: user._id,
      fromUserId: "ADMIN",
      fromUserName: "System Admin",
      type: "alert",
      message: `${title}: ${message}`,
      isRead: false
    }));

    await Notification.insertMany(notifications);

    await createLog(req.user.id, "BROADCAST_SENT", "All Users", `Title: ${title}`);

    res.status(200).json({ message: "Broadcast sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createReport = async (req, res) => {
  try {
    const { reporterId, reporterName, targetEventId, eventTitle, reason } = req.body;
    const newReport = new Report({ reporterId, reporterName, targetEventId, eventTitle, reason });
    await newReport.save();
    res.status(201).json({ message: "Report submitted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: "pending" }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const resolveReport = async (req, res) => {
  try {
    const { id } = req.params;
    const resolvedReport = await Report.findByIdAndUpdate(id, { status: "resolved" });

    await createLog(req.user.id, "REPORT_RESOLVED", `Report ID: ${id}`, `Resolved report for: ${resolvedReport.eventTitle}`);
    
    res.status(200).json({ message: "Report resolved" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getSystemLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json(logs);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
