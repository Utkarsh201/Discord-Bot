import { WebhookClient, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export async function discordMessage(value) {
  const { event, resourceName, start, durationHours, href } = value;

  try {
    const webhookClient = new WebhookClient({ url: WEBHOOK_URL });

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(
        `About to start in 1 hr\n\n` +
          `**${event}**\n` +
          `\`${resourceName} | ${start} | ${durationHours} |\` [link](${href})`
      );

    // 3. Send the message
    await webhookClient.send({
      embeds: [embed],
      username: "PTSCContestBot",
    });
    console.log("Webhook notification sent successfully!");
  } catch (error) {
    console.error("Error sending webhook:", error);
  }
}
