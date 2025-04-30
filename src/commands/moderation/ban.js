const ms = require("ms");

module.exports = {
  name: "ban",
  description: "Ban a member from the server (support reason and duration)",
  usage: "/ban <user> [reason] [duration]",
  permissions: ["BanMembers"],
  cooldown: "5s",
  options: [
    {
      name: "user",
      description: "User to ban",
      type: 6, // USER
      required: true,
    },
    {
      name: "reason",
      description: "Reason for ban",
      type: 3, // STRING
      required: false,
    },
    {
      name: "duration",
      description: "How long to ban (e.g., 1h, 1d)",
      type: 3, // STRING
      required: false,
    },
  ],

  async executeSlash(interaction) {
    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const duration = interaction.options.getString("duration");
    const member = interaction.guild.members.cache.get(user.id);

    if (!interaction.member.permissions.has("BanMembers")) {
      return interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    if (!member) {
      return interaction.reply({ content: "User not found.", ephemeral: true });
    }

    if (!member.bannable) {
      return interaction.reply({
        content: "I cannot ban this user. They might have a higher role.",
        ephemeral: true,
      });
    }

    // DM user
    try {
      await user.send(
        `You have been banned from **${interaction.guild.name}** for: ${reason}`
      );
    } catch (err) {
      console.warn(`Could not send DM to ${user.tag}`);
    }

    await member.ban({ reason: `${reason} - by ${interaction.user.tag}` });
    await interaction.reply(`${user.tag} has been banned. Reason: ${reason}`);

    // Handle temporary ban
    if (duration) {
      const msDuration = ms(duration);
      if (msDuration) {
        setTimeout(async () => {
          try {
            await interaction.guild.members.unban(
              user.id,
              "Temporary ban expired"
            );
          } catch (e) {
            console.error(`Failed to unban ${user.tag}:`, e.message);
          }
        }, msDuration);
      }
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has("BanMembers")) {
      return message.reply("You do not have permission to use this command.");
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply("Please mention a user to ban.");

    const durationArgIndex = args.findIndex((arg) => /\d+[smhd]/i.test(arg));
    const duration = durationArgIndex !== -1 ? args[durationArgIndex] : null;
    const reason =
      args
        .slice(1, durationArgIndex !== -1 ? durationArgIndex : undefined)
        .join(" ") || "No reason provided";
    const member = message.guild.members.cache.get(user.id);

    if (!member) return message.reply("User not found.");
    if (!member.bannable) return message.reply("I cannot ban this user.");

    try {
      await user.send(
        `You have been banned from **${message.guild.name}** for: ${reason}`
      );
    } catch (err) {
      console.warn(`Could not send DM to ${user.tag}`);
    }

    await member.ban({ reason: `${reason} - by ${message.author.tag}` });
    await message.reply(`${user.tag} has been banned. Reason: ${reason}`);

    // Temporary ban
    if (duration) {
      const msDuration = ms(duration);
      if (msDuration) {
        setTimeout(async () => {
          try {
            await message.guild.members.unban(user.id, "Temporary ban expired");
          } catch (e) {
            console.error(`Failed to unban ${user.tag}:`, e.message);
          }
        }, msDuration);
      }
    }
  },
};
