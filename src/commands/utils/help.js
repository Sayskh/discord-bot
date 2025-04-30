const {
  generateHelpMessage,
  generateCommandHelp,
} = require("../../core/commandhandler/help");

module.exports = {
  name: "help",
  description:
    "List all commands or get detailed info about a specific command",
  cooldown: "5s",
  options: [
    {
      name: "command",
      type: 3, // STRING
      description: "The command to get help for",
      required: false,
      autocomplete: true, // Menambahkan autocomplete
    },
  ],

  async executeSlash(interaction) {
    const commandName = interaction.options.getString("command");

    const embed = commandName
      ? generateCommandHelp(interaction.client, commandName.toLowerCase())
      : generateHelpMessage(interaction.client);

    return interaction.reply({ embeds: [embed] });
  },

  async executePrefix(message, args) {
    const embed =
      args.length === 0
        ? generateHelpMessage(message.client)
        : generateCommandHelp(message.client, args[0].toLowerCase());

    return message.channel.send({ embeds: [embed] });
  },
};
