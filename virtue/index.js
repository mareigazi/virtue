const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000, () => console.log('Web server ready'));

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const token = 'MTM2MDc1MTM3NzAyNTg1OTY4NA.GzLm_J.vnBbftevcCLg485fMnAyNvOUeU3qD07CiKeiNU';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

client.login(token);

client.on('messageCreate', message => {
  // Replace this with the actual user's ID
  const targetUserId = '892844342086090832'; // 👈 put their Discord user ID here

  // Check if the message is from that specific user
  if (message.author.id === targetUserId && !message.author.bot) {
    // 10% chance to respond
    if (Math.random() < 0.07) {
      // List of things your bot might randomly say
      const responses = [
        "kyre is the best",
        "don't forget to like and subscribe!",
        "log off",
        "stop lacking",
      ];

      // Pick one at random
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      message.channel.send(randomResponse);
    }
  }

  if (message.author.id === targetUserId && !message.author.bot) {
    // 20% chance to mock
    if (Math.random() < 0.07) {
      // Start typing (simulates delay)
      message.channel.sendTyping();

      // Add a delay before sending the message (simulating typing)
      setTimeout(() => {
        // Repeat the message exactly as it is (mocking tone)
        message.channel.send(message.content);
      }, 1000); // 2 second delay (adjust as needed) 
      }
  }
});
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');

const targetUserId = '892844342086090832';     // ID of the person being quoted
const allowedUserId = '1008528428548509797';   // Only this person can trigger it

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Only allow one specific user to trigger this
  if (message.author.id !== allowedUserId) return;

  // Only trigger if the message mentions the target user
  if (!message.mentions.users.has(targetUserId)) return;

  const channel = message.channel;

  // Get last message from the target user
  const messages = await channel.messages.fetch({ limit: 50 });
  const lastMessage = messages
    .filter(m => m.author.id === targetUserId && m.id !== message.id)
    .first();

  if (!lastMessage) return;

  const quoteContent = lastMessage.content;

  // Build the confirmation buttons
  const confirmRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('quote_yes')
      .setLabel('✅ Yes')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('quote_no')
      .setLabel('❌ no')
      .setStyle(ButtonStyle.Danger)
  );

  // Send the confirmation privately (DM)
  try {
    const dm = await message.author.send({
      content: `Do you want me to Quote **${lastMessage.author.username}**?\n> "${quoteContent}"`,
      components: [confirmRow],
    });

    const collector = dm.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15000,
    });

    collector.on('collect', async (interaction) => {
      if (interaction.user.id !== allowedUserId) {
        return interaction.reply({
          content: "This ain't your quote to approve. 😤",
          ephemeral: true,
        });
      }

      if (interaction.customId === 'quote_yes') {
        await interaction.update({
          content: `Quoted: "${quoteContent}"`,
          components: [],
        });

        // Post quote publicly
        await channel.send(`"${quoteContent}" !!!`);
      } else if (interaction.customId === 'quote_no') {
        await interaction.update({
          content: 'Quote canceled. 😶',
          components: [],
        });
      }
    });

    collector.on('end', async (collected) => {
      if (collected.size === 0) {
        await dm.edit({
          content: '⏱️ Timed out. Quote request canceled.',
          components: [],
        });
      }
    });
  } catch (err) {
    console.error("Couldn't DM the user:", err);
    message.reply("I couldn't message you — do you have DMs off?");
  }
});

client.on('messageCreate', async (message) => {
  // If the message is from the bot itself, ignore it
  if (message.author.bot) return;

  // Check if the message is from the target user
  if (message.author.id === targetUserId) {

    // Check if the sender is the allowed user
    if (message.author.id === targetUserId) {
      // If the allowed person sends a specific command to trigger the bot message

      // Send a discreet message as the bot, making it look natural
      if (message.content.includes('!reply')) { // Example trigger message you could send
        const botMessage = "Here's a secret bot response to you... 🕵️‍♂️";

        // Send the bot message discreetly in the channel
        await message.channel.send(botMessage);
      }
    }
  }
});

// Bible quotes — lowkey judgmental/passive aggressive flavor 😇
const bibleQuotes = {
  judgment: [
    "“The heart is deceitful above all things, and desperately wicked: who can know it?” — Jeremiah 17:9",
    "“Do not be wise in your own eyes; fear the Lord and shun evil.” — Proverbs 3:7",
    "“The way of a fool is right in his own eyes.” — Proverbs 12:15",
    "“Woe to those who call evil good and good evil.” — Isaiah 5:20",
    "“For nothing is hidden that will not be made manifest.” — Luke 8:17",
    "“Every idle word that men shall speak, they shall give account thereof in the day of judgment.” — Matthew 12:36",
    "“Pride goes before destruction, a haughty spirit before a fall.” — Proverbs 16:18",
    "“As a dog returns to its vomit, so fools repeat their folly.” — Proverbs 26:11",
    "“Be not quick in your spirit to become angry, for anger lodges in the bosom of fools.” — Ecclesiastes 7:9",
    "“You are neither cold nor hot... I will spit you out of my mouth.” — Revelation 3:16"
  ],
  subtle: [
    "“Examine yourselves, to see whether you are in the faith.” — 2 Corinthians 13:5",
    "“Let him who thinks he stands take heed lest he fall.” — 1 Corinthians 10:12",
    "“Even a fool who keeps silent is considered wise.” — Proverbs 17:28",
    "“A soft answer turns away wrath, but a harsh word stirs up anger.” — Proverbs 15:1"
  ]
};

function getRandomQuote() {
  const categories = ['judgment', 'judgment', 'subtle']; // more weight on judgment
  const category = categories[Math.floor(Math.random() * categories.length)];
  const quotes = bibleQuotes[category];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.author.id === targetUserId) {
    // 20% chance to DM a quote when target sends a message
    if (Math.random() < 0.2) {
      const quote = getRandomQuote();

      try {
        const user = await client.users.fetch(targetUserId);
        await user.send(quote);
        console.log(`Sent DM to ${user.username}: ${quote}`);
      } catch (err) {
        console.error("Failed to send DM:", err);
      }
    }
  }
});

client.login('MTM2MDc1MTM3NzAyNTg1OTY4NA.GzLm_J.vnBbftevcCLg485fMnAyNvOUeU3qD07CiKeiNU'); // Replace with your actual bot token

const targetChannelId = '1358515867121614859'; // 👈 the channel where bot should send the message

client.on('messageCreate', async (message) => {
  // Ignore bot's own messages
  if (message.author.bot) return;

  // ✅ Only handle DMs from allowed user
  if (message.channel.type === 1 && message.author.id === allowedUserId) {
    const targetChannel = await client.channels.fetch(targetChannelId);

    if (!targetChannel || !targetChannel.isTextBased()) {
      return message.reply('Target channel not found or not text-based.');
    }

    // Send the DM content to the public channel as the bot
    await targetChannel.send(message.content);
    console.log(`Bot echoed: "${message.content}" from ${message.author.username}`);

    // Optional: confirm discreetly
    await message.react('✅');
  }
});





