const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { userWarnings } = require("./warn");

module.exports = {
  name: "warnings",
  description: "Displays the warning list of a user",
  usage: "/warnings <user>",
  cooldown: "5s",
  options: [
    {
      name: "user",
      type: 6, // 6 = User type
      description: "User to view the warning list",
      required: true,
    },
  ],

  async executeSlash(interaction) {
    const user = interaction.options.getUser("user");

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ModerateMembers
      )
    ) {
      return interaction.reply({
        content: "You lack permission.",
        ephemeral: true,
      });
    }

    // Check if the user has any warnings
    const warnings = userWarnings.get(user.id);

    const embed = new EmbedBuilder()
      .setColor(0xffcc00)
      .setTitle(`${user.tag}'s Warning List`)
      .setDescription(
        warnings && warnings > 0
          ? `Total warnings: ${warnings}`
          : `${user.tag} has no warnings.`
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}` });

    return interaction.reply({ embeds: [embed] });
  },

  async executePrefix(message, args) {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)
    ) {
      return message.reply("You lack permission.");
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply("Please mention a user.");

    // Check if the user has any warnings
    const warnings = userWarnings.get(user.id);

    const embed = new EmbedBuilder()
      .setColor(0xffcc00)
      .setTitle(`${user.tag}'s Warning List`)
      .setDescription(
        warnings && warnings > 0
          ? `Total warnings: ${warnings}`
          : `${user.tag} has no warnings.`
      )
      .setFooter({ text: `Requested by ${message.author.tag}` });

    return message.reply({ embeds: [embed] });
  },
};
