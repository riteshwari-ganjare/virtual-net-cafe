const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const ctrl = require("../controllers/serviceController");

router.get("/", ctrl.getServices);
router.post("/", protect, adminOnly, ctrl.createService);
router.delete("/:id", protect, adminOnly, ctrl.deleteService);

module.exports = router;