require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

const eventFiles = fs.readdirSync(path.join(__dirname, 'core', 'events')).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(path.join(__dirname, 'core', 'events', file));
  const eventName = file.split('.')[0];
  client.on(eventName, (...args) => event(client, ...args));
}

client.login(process.env.TOKEN);
