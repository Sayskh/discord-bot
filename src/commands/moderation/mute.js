const ms = require("ms");

module.exports = {
  name: "mute",
  description: "Timeout (mute) a user for a specified duration.",
  usage: "/mute <user> <duration> [reason]",
  cooldown: "5s",
  options: [
    {
      name: "user",
      type: 6, // USER
      description: "User to mute",
      required: true,
    },
    {
      name: "duration",
      type: 3, // STRING
      description: "Duration (e.g., 10m, 1h, 30s)",
      required: true,
    },
    {
      name: "reason",
      type: 3,
      description: "Reason for mute",
      required: false,
    },
  ],

  async executeSlash(interaction) {
    if (!interaction.member.permissions.has("ModerateMembers")) {
      return interaction.reply({
        content: "You lack permission to mute users.",
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser("user");
    const durationInput = interaction.options.getString("duration");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    const member = interaction.guild.members.cache.get(user.id);
    if (!member)
      return interaction.reply({
        content: "User not found in this server.",
        ephemeral: true,
      });

    const timeoutMs = ms(durationInput);
    if (
      !timeoutMs ||
      timeoutMs < 1000 ||
      timeoutMs > 28 * 24 * 60 * 60 * 1000
    ) {
      return interaction.reply({
        content:
          "Invalid duration. Use formats like `10m`, `1h`, `30s`. Max: 28 days.",
        ephemeral: true,
      });
    }

    try {
      await member.timeout(timeoutMs, reason);
      return interaction.reply(
        `${user.tag} has been muted for ${durationInput}. Reason: ${reason}`
      );
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: "Failed to mute user. Do I have enough permissions?",
        ephemeral: true,
      });
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has("ModerateMembers"))
      return message.reply("You lack permission to mute users.");

    const user = message.mentions.users.first();
    const durationInput = args[1];
    const reason = args.slice(2).join(" ") || "No reason provided";

    if (!user || !durationInput)
      return message.reply("Usage: !mute @user <duration> [reason]");

    const member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply("User not found.");

    const timeoutMs = ms(durationInput);
    if (
      !timeoutMs ||
      timeoutMs < 1000 ||
      timeoutMs > 28 * 24 * 60 * 60 * 1000
    ) {
      return message.reply(
        "Invalid duration. Use formats like `10m`, `1h`, `30s`. Max: 28 days."
      );
    }

    try {
      await member.timeout(timeoutMs, reason);
      return message.reply(
        `${user.tag} has been muted for ${durationInput}. Reason: ${reason}`
      );
    } catch (err) {
      console.error(err);
      return message.reply("Failed to mute user.");
    }
  },
};
