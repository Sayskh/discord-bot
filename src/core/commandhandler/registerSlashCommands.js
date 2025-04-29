const { REST, Routes } = require('discord.js');
require('dotenv').config();

async function registerSlashCommands(client) {
  const commands = [];

  for (const command of client.commands.values()) {
    if (command.options) {
      commands.push({
        name: command.name,
        description: command.description,
        options: command.options,
      });
    } else {
      commands.push({
        name: command.name,
        description: command.description,
      });
    }
  }

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

  } catch (error) {
    console.error(error);
  }
}

module.exports = { registerSlashCommands };
