import cron from "node-cron";
import { getContest } from "./apiCall.js";
import { isAllowedContest } from "./contestFilter.js";
import { discordMessage } from "./discord.js";

cron.schedule("* * * * *", async () => {
  try {
    const contests = await getContest();

    if (!contests || contests.length === 0) {
      console.log("No contests during this hour");
      return;
    }
    console.log("1...............");
    contests
    .filter(isAllowedContest)  
    .forEach((c) => {
      const durationHours = (c.duration / 3600).toFixed(2);
      
      discordMessage(
        c.event,
        c.resource,
        c.start,
        durationHours,
        c.href
      );
    });
    console.log("2...............");
  } catch (error) {
    console.error("Cron job failed:", error.message);
  }
});
