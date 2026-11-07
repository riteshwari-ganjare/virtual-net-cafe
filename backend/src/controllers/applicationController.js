const Application = require("../models/Application");
const imagekit = require("../config/imagekit");

exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadPaymentReceipt = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (String(app.userId) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });
    if (app.status !== "Ready for Payment") {
      return res.status(400).json({ message: "Application not ready for payment" });
    }
    if (!req.file) return res.status(400).json({ message: "Receipt file required" });

    if (app.paymentReceiptFileId) {
      try { await imagekit.deleteFile(app.paymentReceiptFileId); } catch {}
    }
    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/virtual-net-cafe/receipts",
    });
    app.paymentReceiptUrl = result.url;
    app.paymentReceiptFileId = result.fileId;
    app.status = "Payment Submitted";
    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};