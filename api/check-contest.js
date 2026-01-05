import { getContest } from "../apiCall.js";
import { isAllowedContest } from "../contestFilter.js";
import { discordMessage } from "../discord.js";

export default async function handler(req, res) {
  // 1. SECURITY: Check for a secret key
  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const contests = await getContest();

    if (!contests || contests.length === 0) {
      return res.status(200).json({ message: "No contests found" });
    }

    const allowed = contests.filter(isAllowedContest);

    // Use Promise.all to ensure all messages are sent before function ends
    await Promise.all(
      allowed.map(async (c) => {
        const durationHours = (c.duration / 3600).toFixed(2);
        await discordMessage(
          c.event,
          c.resource,
          c.start,
          durationHours,
          c.href
        );
      })
    );

    return res.status(200).json({ success: true, processed: allowed.length });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
