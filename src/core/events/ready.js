const { registerSlashCommands } = require('../commandhandler/registerSlashCommands');
const presenceManager = require('../../config/presenceManager');
const { loadCommands } = require('../commandhandler/commandHandler');

module.exports = async (client) => {
  console.log(`${client.user.tag} has logged in.`);
  loadCommands(client);
  registerSlashCommands(client);
  presenceManager(client);
};
