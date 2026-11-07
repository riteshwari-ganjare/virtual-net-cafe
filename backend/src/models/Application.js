const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serviceType: { type: String, required: true },
    status: {
      type: String,
      enum: ["Submitted", "In Progress", "Ready for Payment", "Payment Submitted", "Completed"],
      default: "Submitted",
    },
    basicInfo: {
      name: String,
      phone: String,
      email: String,
      address: String,
    },
    uploadedDocs: [
      {
        url: String,
        fileId: String,
        name: String,
      },
    ],
    paymentReceiptUrl: { type: String, default: "" },
    paymentReceiptFileId: { type: String, default: "" },
    finalResultUrl: { type: String, default: "" },
    finalFileId: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);