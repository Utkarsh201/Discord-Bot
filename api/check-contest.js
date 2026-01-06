import { getContest } from "../apiCall.js";
import { isAllowedContest } from "../contestFilter.js";
import { discordMessage } from "../discord.js";
import { Log } from "../Contest.js";
import dotenv from "dotenv"
import mongoose from "mongoose";

dotenv.config();


let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in Environment Variables");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

// Vercel REQUIRES this default export function
export default async function handler(req, res) {
  // Optional: Security Check (Recommended)

  // this is to not allow any unauthorized user.
  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await connectToDatabase();
    console.log("Starting job...");
    const contests = await getContest();

    if (!contests || contests.length === 0) {
      console.log("No contests found right now.");
      // Send a response back to GitHub Actions so it knows we are done
      return res.status(200).json({ message: "No contests found" });
    }

    console.log("Processing contests...");

    // Fix: Use 'for...of' loop so we wait for each message to send
    const allowedContests = contests.filter(isAllowedContest);

    

    for (const c of allowedContests) {
      const durationHours = (c.duration / 3600).toFixed(2);

      const contestId = `sent:${c.resource}:${c.event}:${c.start}`;

      // const alreadySent = await Log.findById(contestId);
      // if (alreadySent) {
      //   console.log(`Skipping ${c.event} - Already notified.`);
      //   continue; 
      // }
      // We await this so the function doesn't close before sending
      await discordMessage(c.event, c.resource, c.start, durationHours, c.href);
      await Log.create({ _id: contestId });
    }

    console.log("Job finished successfully.");

    // Return success to Vercel/GitHub
    return res
      .status(200)
      .json({ success: true, count: allowedContests.length });
  } catch (error) {
    console.error("Job failed:", error.message);
    // Return error status instead of killing the process
    return res.status(500).json({ error: error.message });
  }
}
