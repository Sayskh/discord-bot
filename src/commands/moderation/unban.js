module.exports = {
  name: "unban",
  description: "Unban a user from the server by user ID.",
  usage: "/unban <user_id> [reason]",
  permissions: ["BanMembers"],
  cooldown: "5s",

  options: [
    {
      name: "user_id",
      description: "ID of the user to unban",
      type: 3, // STRING
      required: true,
    },
    {
      name: "reason",
      description: "Reason for unbanning",
      type: 3,
      required: false,
    },
  ],

  async executeSlash(interaction) {
    const userId = interaction.options.getString("user_id");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    if (!interaction.member.permissions.has("BanMembers")) {
      return interaction.reply({
        content: "You do not have permission to unban users.",
        ephemeral: true,
      });
    }

    try {
      await interaction.guild.members.unban(userId, reason);
      return interaction.reply(
        `User with ID \`${userId}\` has been unbanned. Reason: ${reason}`
      );
    } catch (err) {
      return interaction.reply({
        content: `Failed to unban user. Maybe they are not banned?`,
        ephemeral: true,
      });
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has("BanMembers"))
      return message.reply("You do not have permission to unban users.");

    const userId = args[0];
    const reason = args.slice(1).join(" ") || "No reason provided";

    if (!userId) return message.reply("Please provide a user ID.");

    try {
      await message.guild.members.unban(userId, reason);
      return message.reply(
        `User with ID \`${userId}\` has been unbanned. Reason: ${reason}`
      );
    } catch (err) {
      return message.reply("Failed to unban user. Maybe they are not banned?");
    }
  },
};
