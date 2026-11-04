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
    if (!["Submitted", "In Progress", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
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

    // Upload final document if provided
    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/virtual-net-cafe/final",
      });
      app.finalResultUrl = result.url;
      app.finalFileId = result.fileId;
    }

    // Delete original uploaded docs from ImageKit
    if (app.uploadedDocs && app.uploadedDocs.length) {
      for (const doc of app.uploadedDocs) {
        if (doc.fileId) {
          try {
            await imagekit.deleteFile(doc.fileId);
          } catch (e) {
            console.error("ImageKit delete failed:", e.message);
            // Do not mark completed until deletion succeeds
            return res.status(500).json({ message: "Failed to delete original files: " + e.message });
          }
        }
      }
    }

    // Wipe sensitive data
    app.uploadedDocs = [];
    app.basicInfo = { name: "", phone: "", email: "", address: "" };
    app.status = "Completed";
    await app.save();

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};