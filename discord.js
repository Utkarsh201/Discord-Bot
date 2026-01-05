import { WebhookClient, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export async function discordMessage(
  event,
  resourceName,
  start,
  durationHours,
  href
) {
  try {
    const webhookClient = new WebhookClient({ url: WEBHOOK_URL });

    const startDate = new Date(start);

    // --- CHANGE START: Convert to IST ---

    // Uses 'en-CA' because it forces YYYY-MM-DD format
    const date = startDate.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    // Uses 'en-GB' because it usually defaults to HH:MM (24-hour)
    const time = startDate.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // --- CHANGE END ---

    const hours = Math.floor(durationHours);
    const minutes = Math.round((durationHours - hours) * 60);
    const durationFormatted = `${hours}h ${minutes}m`;

    const embed = new EmbedBuilder()
      .setColor(0x3498db) // blue
      .setDescription(
        `**${event}**\n` +
          `\`${resourceName}\`\n` +
          `📅 Date: \`${date}\`\n` +
          `⏰ Time: \`${time}\` (IST)\n` + // Added (IST) label for clarity
          `⏳ Duration: \`${durationFormatted}\`\n\n` +
          `[🔗 Contest Link](${href})`
      );

    // 3. Send the message
    await webhookClient.send({
      embeds: [embed],
      username: "PTSC Contest Bot",
    });
    console.log("Webhook notification sent successfully!");
  } catch (error) {
    console.error("Error sending webhook:", error);
  }
}
