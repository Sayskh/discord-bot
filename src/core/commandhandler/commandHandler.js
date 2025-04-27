const fs = require('node:fs');
const path = require('node:path');

function loadCommands(client) {
  client.commands = new Map();
  const commandFiles = fs.readdirSync(path.join(__dirname, '..', '..', 'commands')).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const command = require(path.join(__dirname, '..', '..', 'commands', file));
    client.commands.set(command.name, command);
    console.log(`Loaded command: ${command.name}`);
  }
}

module.exports = { loadCommands };
