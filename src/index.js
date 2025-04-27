require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config/config.json');
const { loadCommands } = require('./core/commandhandler/commandHandler');
const presenceManager = require('./config/presenceManager');
const fs = require('node:fs');
const path = require('node:path');
const client = new Client({
  intents: config.intents || [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

loadCommands(client);

const eventFiles = fs.readdirSync(path.join(__dirname, 'core', 'events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(path.join(__dirname, 'core', 'events', file));
  const eventName = file.split('.')[0];
  client.on(eventName, (...args) => event(client, ...args));
}

client.once('ready', async () => {
  console.log(`${client.user.tag} is ready!`);
    presenceManager(client);
});

client.login(process.env.TOKEN);
