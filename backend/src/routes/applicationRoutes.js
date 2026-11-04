const express = require("express");
const multer = require("multer");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const appCtrl = require("../controllers/applicationController");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/my", protect, appCtrl.getMyApplications);
router.post("/", protect, upload.array("docs", 10), appCtrl.createApplication);

module.exports = router;