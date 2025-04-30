const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { userWarnings } = require("./warn");

module.exports = {
  name: "clearwarn",
  description: "Clear warning(s) for a user",
  usage: "/clearwarn <user>",
  cooldown: "5s",
  options: [
    {
      name: "user",
      type: 6,
      description: "User to clear warnings",
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

    if (!userWarnings.has(user.id)) {
      return interaction.reply({
        content: "User has no warnings.",
        ephemeral: true,
      });
    }

    userWarnings.delete(user.id);

    const embed = new EmbedBuilder()
      .setColor(0x00cc99)
      .setTitle("✅ Warnings Cleared")
      .setDescription(`Warnings for ${user.tag} have been cleared.`)
      .setFooter({ text: `Moderator: ${interaction.user.tag}` });

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

    if (!userWarnings.has(user.id)) {
      return message.reply("User has no warnings.");
    }

    userWarnings.delete(user.id);

    const embed = new EmbedBuilder()
      .setColor(0x00cc99)
      .setTitle("✅ Warnings Cleared")
      .setDescription(`Warnings for ${user.tag} have been cleared.`)
      .setFooter({ text: `Moderator: ${message.author.tag}` });

    return message.reply({ embeds: [embed] });
  },
};
