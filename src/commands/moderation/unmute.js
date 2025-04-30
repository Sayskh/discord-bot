module.exports = {
  name: "unmute",
  description: "Remove timeout from a user.",
  usage: "/unmute <user>",
  permissions: ["ModerateMembers"],
  cooldown: "5s",

  options: [
    {
      name: "user",
      description: "User to unmute",
      type: 6, // USER
      required: true,
    },
  ],

  async executeSlash(interaction) {
    const user = interaction.options.getUser("user");
    const member = interaction.guild.members.cache.get(user.id);

    if (!interaction.member.permissions.has("ModerateMembers")) {
      return interaction.reply({
        content: "You do not have permission to unmute users.",
        ephemeral: true,
      });
    }

    if (!member)
      return interaction.reply({ content: "User not found.", ephemeral: true });

    try {
      await member.timeout(null); // null artinya hapus timeout
      return interaction.reply(`${user.tag} has been unmuted.`);
    } catch (err) {
      return interaction.reply({
        content: "Failed to unmute user.",
        ephemeral: true,
      });
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has("ModerateMembers"))
      return message.reply("You do not have permission to unmute users.");

    const user = message.mentions.users.first();
    if (!user) return message.reply("Please mention a user to unmute.");

    const member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply("User not found.");

    try {
      await member.timeout(null);
      return message.reply(`${user.tag} has been unmuted.`);
    } catch (err) {
      return message.reply("Failed to unmute user.");
    }
  },
};
