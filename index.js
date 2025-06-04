import { Client, GatewayIntentBits, Partials } from "discord.js";
import InMemoryScranSubmissionRepository from "./infrastructure/InMemoryScranSubmissionRepository.js";
import startSchedulers from "./entrypoints/scheduler.js";
import onMessageCreate from "./entrypoints/onMessageCreate.js";
import onMessageReactionAdd from "./entrypoints/onMessageReactionAdd.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const scranRepo = new InMemoryScranSubmissionRepository();

startSchedulers(scranRepo);

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  try {
    const destinationChannel = await client.channels.fetch(
      process.env.SCRAN_DESTINATION_CHANNEL_ID
    );
    await onMessageCreate(message, scranRepo, destinationChannel);
  } catch (err) {
    console.error("Error in messageCreate handler:", err);
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  try {
    await onMessageReactionAdd(reaction, user, scranRepo);
  } catch (err) {
    console.error("Error in messageReactionAdd handler:", err);
  }
});

client.login(process.env.DISCORD_TOKEN);
