module.exports = {
  name: "userinfo",
  description: "Menampilkan informasi tentang pengguna",
  usage: "/userinfo [target]",
  aliases: ["uinfo", "whois"],
  cooldown: "5s",

  options: [
    {
      name: "user",
      description: "Mention user atau masukkan ID mereka",
      type: 3, // STRING
      required: false,
    },
  ],

  // PREFIX COMMAND (!userinfo)
  async executePrefix(message, args) {
    const input = args[0];
    let member;

    if (!input) {
      member = message.member;
    } else {
      const match = input.match(/^<@!?(\d+)>$|^(\d+)$/);
      const userId = match?.[1] || match?.[2];

      if (userId) {
        member = await message.guild.members.fetch(userId).catch(() => null);
      }
    }

    if (!member) {
      return message.reply("❌ Tidak dapat menemukan user tersebut.");
    }

    const embed = await generateUserInfoEmbed(member);
    return message.reply({ embeds: [embed] });
  },

  // SLASH COMMAND (/userinfo)
  async executeSlash(interaction) {
    const input = interaction.options.getString("target");
    let member;

    if (!input) {
      member = interaction.member;
    } else {
      const match = input.match(/^<@!?(\d+)>$|^(\d+)$/);
      const userId = match?.[1] || match?.[2];

      if (userId) {
        member = await interaction.guild.members
          .fetch(userId)
          .catch(() => null);
      }
    }

    if (!member) {
      return interaction.reply({
        content: "❌ Tidak dapat menemukan user tersebut.",
        ephemeral: true,
      });
    }

    const embed = await generateUserInfoEmbed(member);
    return interaction.reply({ embeds: [embed] });
  },
};

// Fungsi pembuat embed
async function generateUserInfoEmbed(member) {
  const user = member.user;
  const roles =
    member.roles.cache
      .filter((role) => role.id !== member.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((role) => `<@&${role.id}>`)
      .join(" ") || "None";

  const embed = {
    color:
      member.displayHexColor === "#000000"
        ? 0x2f3136
        : parseInt(member.displayHexColor.replace("#", ""), 16),
    title: `Informasi ${user.tag}`,
    thumbnail: { url: user.displayAvatarURL({ dynamic: true }) },
    fields: [
      {
        name: `👤 ${user.tag}`,
        value: `${user.id}`,
      },
      {
        name: "📅 Akun Dibuat",
        value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
        inline: true,
      },
      {
        name: "⏳ Bergabung Server",
        value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`,
        inline: true,
      },
      {
        name: "🚀 Server Booster?",
        value: member.premiumSince
          ? `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:F>`
          : "Tidak",
        inline: true,
      },
      {
        name: "🎭 Role",
        value: roles,
      },
    ],
    footer: { text: `ID: ${user.id}` },
    timestamp: new Date(),
  };

  return embed;
}
