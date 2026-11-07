const Application = require("../models/Application");
const imagekit = require("../config/imagekit");

exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find().populate("userId", "name email").sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Submitted", "In Progress", "Ready for Payment"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (app.status === "Completed") return res.status(400).json({ message: "Application already completed" });
    app.status = status;
    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.completeApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (app.status !== "Payment Submitted") {
      return res.status(400).json({ message: "User must submit payment receipt before completion" });
    }

    // Upload final printed/submitted document
    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/virtual-net-cafe/final",
      });
      app.finalResultUrl = result.url;
      app.finalFileId = result.fileId;
    } else {
      return res.status(400).json({ message: "Final document required" });
    }

    // Delete original uploaded docs from ImageKit
    if (app.uploadedDocs && app.uploadedDocs.length) {
      for (const doc of app.uploadedDocs) {
        if (doc.fileId) {
          try {
            await imagekit.deleteFile(doc.fileId);
          } catch (e) {
            console.error("ImageKit delete failed:", e.message);
            return res.status(500).json({ message: "Failed to delete original files: " + e.message });
          }
        }
      }
    }

    // Delete payment receipt from ImageKit
    if (app.paymentReceiptFileId) {
      try {
        await imagekit.deleteFile(app.paymentReceiptFileId);
      } catch (e) {
        console.error("ImageKit receipt delete failed:", e.message);
      }
    }

    // Wipe sensitive data
    app.uploadedDocs = [];
    app.basicInfo = { name: "", phone: "", email: "", address: "" };
    app.paymentReceiptUrl = "";
    app.paymentReceiptFileId = "";
    app.status = "Completed";
    await app.save();

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};