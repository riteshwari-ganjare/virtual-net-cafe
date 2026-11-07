const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const ctrl = require("../controllers/serviceController");

router.get("/", ctrl.getServices);
router.get("/:id", ctrl.getService);
router.post("/", protect, adminOnly, ctrl.createService);
router.put("/:id", protect, adminOnly, ctrl.updateService);
router.delete("/:id", protect, adminOnly, ctrl.deleteService);

module.exports = router;