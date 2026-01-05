import cron from "node-cron";
import { getContest } from "./apiCall.js";
import { isAllowedContest } from "./contestFilter.js";
import { discordMessage } from "./discord.js";

// cron.schedule("* * * * *", async () => {
  
// });


async function runJob() {
  try {
    console.log("Starting job...");
    const contests = await getContest();

    if (!contests || contests.length === 0) {
      console.log("No contests found right now.");
      return; 
    }

    console.log("Processing contests...");
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
    
    console.log("Job finished successfully.");

  } catch (error) {
    console.error("Job failed:", error.message);
    // Exit with error code 1 so GitHub Actions knows it failed
    process.exit(1); 
  }
}

runJob();