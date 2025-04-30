const { EmbedBuilder, PermissionsBitField } = require("discord.js");

const userWarnings = new Map();
const TIMEOUT_DURATION_MS = 10 * 60 * 1000;

function formatMs(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""}`;
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  return `${seconds} second${seconds !== 1 ? "s" : ""}`;
}

module.exports = {
  name: "warn",
  description: "Warn a user. 3 warns = timeout",
  usage: "/warn <user> [reason]",
  cooldown: "5s",
  options: [
    {
      name: "user",
      type: 6,
      description: "User to warn",
      required: true,
    },
    {
      name: "reason",
      type: 3,
      description: "Reason for the warning",
      required: false,
    },
  ],

  async executeSlash(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason";
    const member = interaction.guild.members.cache.get(user.id);

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

    if (!member)
      return interaction.reply({ content: "User not found.", ephemeral: true });

    const warnings = userWarnings.get(user.id) || 0;
    const newWarnings = warnings + 1;
    userWarnings.set(user.id, newWarnings);

    try {
      await user.send(
        `You have been warned in **${interaction.guild.name}**.\nReason: ${reason}\nTotal warnings: ${newWarnings}`
      );
    } catch {}

    const embed = new EmbedBuilder()
      .setColor(0xffcc00)
      .setTitle("⚠️ User Warned")
      .setDescription(
        `${user.tag} has been warned.\n**Reason:** ${reason}\n**Warnings:** ${newWarnings}/3`
      )
      .setFooter({ text: `Moderator: ${interaction.user.tag}` });

    if (newWarnings >= 3) {
      try {
        await member.timeout(
          TIMEOUT_DURATION_MS,
          `Auto-timeout after 3 warnings.`
        );
        embed.setDescription(
          `${user.tag} has been warned and timed out for ${formatMs(
            TIMEOUT_DURATION_MS
          )}.`
        );
      } catch {
        return interaction.reply({
          content: "Failed to timeout user.",
          ephemeral: true,
        });
      }
    }

    return interaction.reply({ embeds: [embed] });
  },

  async executePrefix(message, args) {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)
    )
      return message.reply("You lack permission.");

    const user = message.mentions.users.first();
    const reason = args.slice(1).join(" ") || "No reason";
    if (!user) return message.reply("Please mention a user.");

    const member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply("User not found.");

    const warnings = userWarnings.get(user.id) || 0;
    const newWarnings = warnings + 1;
    userWarnings.set(user.id, newWarnings);

    try {
      await user.send(
        `You have been warned in **${message.guild.name}**.\nReason: ${reason}\nTotal warnings: ${newWarnings}`
      );
    } catch {}

    const embed = new EmbedBuilder()
      .setColor(0xffcc00)
      .setTitle("⚠️ User Warned")
      .setDescription(
        `${user.tag} has been warned.\n**Reason:** ${reason}\n**Warnings:** ${newWarnings}/3`
      )
      .setFooter({ text: `Moderator: ${message.author.tag}` });

    if (newWarnings >= 3) {
      try {
        await member.timeout(
          TIMEOUT_DURATION_MS,
          `Auto-timeout after 3 warnings.`
        );
        embed.setDescription(
          `${user.tag} has been warned and timed out for ${formatMs(
            TIMEOUT_DURATION_MS
          )}.`
        );
      } catch {
        return message.reply("Failed to timeout user.");
      }
    }

    return message.reply({ embeds: [embed] });
  },
};

// Export map for use in clearwarn
module.exports.userWarnings = userWarnings;
