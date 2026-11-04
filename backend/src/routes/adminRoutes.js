const express = require("express");
const multer = require("multer");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const adminCtrl = require("../controllers/adminController");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/applications", protect, adminOnly, adminCtrl.getAllApplications);
router.put("/applications/:id/status", protect, adminOnly, adminCtrl.updateStatus);
router.put("/applications/:id/complete", protect, adminOnly, upload.single("finalDoc"), adminCtrl.completeApplication);

module.exports = router;