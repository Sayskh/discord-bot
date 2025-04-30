const { Collection } = require("discord.js");
const {
  registerSlashCommands,
} = require("../commandhandler/registerSlashCommands");
const presenceManager = require("../../config/presenceManager");
const { loadCommands } = require("../commandhandler/commandHandler");

module.exports = async (client) => {
  console.log(`${client.user.tag} has logged in.`);

  // 💡 Pastikan client.commands adalah Collection, bukan Map
  client.commands = new Collection();

  // 1. Load semua command ke dalam client.commands
  loadCommands(client);

  // 2. Registrasi slash commands ke Discord
  registerSlashCommands(client);

  // 3. Atur status/presensi bot
  presenceManager(client);
};
