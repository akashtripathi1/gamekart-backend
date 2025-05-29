import mongoose from "mongoose";

const approvedEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "customer", "rider"],
    required: true,
  },
});

const ApprovedEmail = mongoose.model("ApprovedEmail", approvedEmailSchema);

export default ApprovedEmail;
