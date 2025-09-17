import cron from "node-cron";
import transporter from "../config/mailer";
import Request from "../models/Request";
import User from "../models/User"; // 👈 assuming this exists

console.log("✅ Reminder job initialized");

// Runs every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("⏰ Running 5-min reminder job...");

  try {
    const now = new Date();

    // Find requests that are still pending and older than 1 hour
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const pendingRequests = await Request.find({
      status: "pending",
      createdAt: { $lte: oneHourAgo },
    })
      .populate<{ requester: { name: string; email: string } }>(
        "requester",
        "name email"
      )
      .populate<{ responders: { name: string; email: string }[] }>(
        "responders",
        "name email"
      );

    console.log(`Found ${pendingRequests.length} stale requests`);

    if (pendingRequests.length === 0) return;

    // Fetch ALL registered responders
    const allResponders = await User.find({ type: "B" }, "name email");

    console.log(`Total responders in system: ${allResponders.length}`);

    for (const req of pendingRequests) {
      // If no responders have accepted/responded yet
      if (!req.responders || req.responders.length === 0) {
        for (const responder of allResponders) {
          if (!responder.email) continue;

          console.log(`📧 Sending reminder for request ${req._id} to ${responder.email}`);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✔ Loaded" : "❌ Missing");
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: responder.email,
            subject: "Reminder: Pending Request Needs Response",
            text: `Hello ${responder.name},

There is a pending request: "${req.description}" created by ${req.requester?.name}.

This request has been pending for over 1 hour without any response.
Please log in and accept it if you can help.

- CommLink`,
          });
        }
      }
    }
  } catch (err) {
    console.error("❌ Reminder job error:", err);
  }
});
