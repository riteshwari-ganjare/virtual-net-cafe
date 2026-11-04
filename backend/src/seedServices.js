require("dotenv").config();
const connectDB = require("./config/db");
const Service = require("./models/Service");

const SERVICES = [
  "PAN Card",
  "Voter ID Related Service",
  "Passport Application",
  "Ayushman Bharat Card",
  "E-Shram Card",
  "PM Kisan Scheme",
  "Various Government Scheme Applications",
  "Online Exam Form",
  "Government Job Form",
  "Scholarship Form",
  "Online Admission Process",
  "Electricity Bill Payment",
  "Mobile Recharge",
  "Online Payment",
  "Digital Service",
  "Document Scanning",
  "Black and White Print",
  "Color Print",
  "Xerox",
];

(async () => {
  await connectDB();
  for (const name of SERVICES) {
    const exists = await Service.findOne({ name });
    if (!exists) await Service.create({ name });
  }
  console.log("Services seeded");
  process.exit(0);
})();