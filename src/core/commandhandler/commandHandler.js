// src/core/commandhandler/commandHandler.js
const fs = require('node:fs');
const path = require('node:path');

function loadCommands(client) {
  client.commands = new Map();

  const commandsPath = path.join(__dirname, '..', '..', 'commands');
  
  // Baca semua subfolder dalam commands
  const folders = fs.readdirSync(commandsPath);

  for (const folder of folders) {
    const commandFiles = fs.readdirSync(path.join(commandsPath, folder)).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const command = require(path.join(commandsPath, folder, file));
      client.commands.set(command.name, command);
      console.log(`Loaded command: ${command.name}`);
    }
  }
}

module.exports = { loadCommands };
