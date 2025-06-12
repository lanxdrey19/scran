import {
  Client,
  GatewayIntentBits,
  Partials,
  TextChannel,
  Message,
  MessageReaction,
  User,
  PartialMessageReaction,
  PartialUser,
} from "discord.js";
import dotenv from "dotenv";
import InMemoryScranSubmissionRepository from "./infrastructure/InMemoryScranSubmissionRepository.js";
import startSchedulers from "./entrypoints/scheduler.js";
import onMessageCreate from "./entrypoints/onMessageCreate.js";
import onMessageReactionAdd from "./entrypoints/onMessageReactionAdd.js";

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
  if (client.user) {
    console.log(`🤖 Logged in as ${client.user.tag}`);
  }
});

client.on("messageCreate", async (message: Message) => {
  try {
    const channelId = process.env.SCRAN_DESTINATION_CHANNEL_ID;
    if (!channelId) throw new Error("SCRAN_DESTINATION_CHANNEL_ID not set");

    const channel = await client.channels.fetch(channelId);
    if (!channel?.isTextBased()) {
      throw new Error("Destination channel is not text-based");
    }

    await onMessageCreate(message, scranRepo, channel as TextChannel);
  } catch (err: unknown) {
    console.error("Error in messageCreate handler:", err);
  }
});

client.on(
  "messageReactionAdd",
  async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    try {
      await onMessageReactionAdd(reaction, user, scranRepo);
    } catch (err: unknown) {
      console.error("Error in messageReactionAdd handler:", err);
    }
  }
);

client.login(process.env.DISCORD_TOKEN);
