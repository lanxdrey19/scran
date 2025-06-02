const { Client, GatewayIntentBits, Partials } = require("discord.js");
require("dotenv").config();

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

const emojiMap = {
  "0️⃣": 0,
  "1️⃣": 1,
  "2️⃣": 2,
  "3️⃣": 3,
  "4️⃣": 4,
  "5️⃣": 5,
  "6️⃣": 6,
  "7️⃣": 7,
  "8️⃣": 8,
  "9️⃣": 9,
  "🔟": 10,
};

const RATING_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Maps original message ID to forwarded message + ratings
const messageRatings = new Map();

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    message.reply("Pong!");
    return;
  }

  // Only respond in a specific channel
  if (message.channel.id !== process.env.SCRAN_SOURCE_CHANNEL_ID) return;

  // Filter image attachments
  const imageAttachments = message.attachments.filter((att) =>
    att.contentType?.startsWith("image/")
  );

  if (imageAttachments.size === 0) return;

  console.log(
    `🖼️ Image posted by ${message.author.username}: ${
      message.attachments.first().url
    }`
  );
  await message.reply("Nice image!");

  const destChannel = await client.channels.fetch(
    process.env.SCRAN_DESTINATION_CHANNEL_ID
  );

  const files = imageAttachments.map((att) => att.url);

  const forwardedMsg = await destChannel.send({
    content: `📨 Forwarded from ${message.author}:\n${
      message.content || "*[no text]*"
    }\n\n⭐ Average Rating: **N/A**`,
    files,
  });

  messageRatings.set(message.id, {
    sourceMsg: message,
    destMsg: forwardedMsg,
    ratings: new Map(), // userId => numeric rating
    expiresAt: Date.now() + RATING_EXPIRY_MS,
  });

  // Add reactions
  const emojiReactions = Object.keys(emojiMap);
  for (const emoji of emojiReactions) {
    await message.react(emoji);
  }

  await message.reply("Image forwarded!");
});

// Handle reactions to source messages
client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (err) {
      console.error("Failed to fetch reaction:", err);
      return;
    }
  }

  const ratingInfo = messageRatings.get(reaction.message.id);
  if (!ratingInfo) return;

  if (Date.now() > ratingInfo.expiresAt) {
    console.log("Rating period has expired.");
    return;
  }

  const numeric = emojiMap[reaction.emoji.name];
  if (numeric === undefined) return;

  // Only allow one rating per user — overwrite previous
  ratingInfo.ratings.set(user.id, numeric);

  // Calculate average
  const values = [...ratingInfo.ratings.values()];
  const average = values.reduce((a, b) => a + b, 0) / values.length;

  const rounded = average.toFixed(2);
  const newContent =
    `📨 Forwarded from ${ratingInfo.sourceMsg.author}:\n` +
    `${ratingInfo.sourceMsg.content || "*[no text]*"}\n\n` +
    `⭐ Average Rating: **${rounded}** from ${values.length} rating(s)`;

  // Edit the forwarded message
  ratingInfo.destMsg.edit({ content: newContent });
});

setInterval(() => {
  console.log("🔄 Running rating cleanup check...");
  const now = Date.now();
  for (const [msgId, info] of messageRatings.entries()) {
    if (now > info.expiresAt) {
      console.log(`🗑 Removing expired rating for message ID: ${msgId}`);
      messageRatings.delete(msgId);
    }
  }
}, 24 * 60 * 60 * 1000); // every day

client.login(process.env.DISCORD_TOKEN);
