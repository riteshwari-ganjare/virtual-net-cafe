const Service = require("../models/Service");

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const { name, documents } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Name required" });
    const exists = await Service.findOne({ name: name.trim() });
    if (exists) return res.status(400).json({ message: "Service already exists" });
    const docs = Array.isArray(documents)
      ? documents.map((d) => (typeof d === "string" ? d.trim() : "")).filter(Boolean)
      : (typeof documents === "string" ? documents.split(",").map((d) => d.trim()).filter(Boolean) : []);
    const service = await Service.create({ name: name.trim(), documents: docs });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    const { name, documents } = req.body;
    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed) return res.status(400).json({ message: "Name required" });
      const exists = await Service.findOne({ name: trimmed, _id: { $ne: service._id } });
      if (exists) return res.status(400).json({ message: "Service already exists" });
      service.name = trimmed;
    }
    if (documents !== undefined) {
      const docs = Array.isArray(documents)
        ? documents.map((d) => (typeof d === "string" ? d.trim() : "")).filter(Boolean)
        : (typeof documents === "string" ? documents.split(",").map((d) => d.trim()).filter(Boolean) : []);
      service.documents = docs;
    }
    await service.save();
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};