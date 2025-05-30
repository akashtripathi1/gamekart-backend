import mongoose from "mongoose";
import dotenv from "dotenv";
import ApprovedEmail from "./src/models/ApprovedEmails.js";

dotenv.config();

const seedEmails = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const emails = [
    { email: "akashtripathi1729@gmail.com", role: "customer" },
    { email: "akashtripathidev@gmail.com", role: "admin" },
    { email: "liverecording.kgp@gmail.com", role: "rider" },
    { email: "akashtripathi@kgpian.iitkgp.ac.in", role: "rider" },
    { email: "abhishek@zuvees.com", role: "admin" }
  ];

  for (const email of emails) {
    await ApprovedEmail.updateOne(
      { email: email.email },
      { $set: email },
      { upsert: true }
    );
  }

  console.log("✅ Emails seeded successfully");
  process.exit();
};

seedEmails();