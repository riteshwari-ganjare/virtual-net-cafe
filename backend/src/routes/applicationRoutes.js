const express = require("express");
const multer = require("multer");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const appCtrl = require("../controllers/applicationController");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/my", protect, appCtrl.getMyApplications);
router.post("/", protect, upload.array("docs", 10), appCtrl.createApplication);
router.put("/:id/payment-receipt", protect, upload.single("receipt"), appCtrl.uploadPaymentReceipt);

module.exports = router;