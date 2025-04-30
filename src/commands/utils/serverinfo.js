module.exports = {
  name: "serverinfo",
  description: "Menampilkan informasi server ini",
  usage: "/serverinfo",
  aliases: ["sinfo", "guildinfo"],
  cooldown: "5s",

  options: [], // Tidak ada opsi untuk slash command

  // PREFIX (!serverinfo)
  async executePrefix(message) {
    const embed = await generateServerInfoEmbed(message.guild);
    await message.reply({ embeds: [embed] });
  },

  // SLASH (/serverinfo)
  async executeSlash(interaction) {
    const embed = await generateServerInfoEmbed(interaction.guild);
    await interaction.reply({ embeds: [embed] });
  },
};

// Fungsi untuk membuat embed informasi server
async function generateServerInfoEmbed(guild) {
  const owner = await guild.fetchOwner();
  const boostLevel = guild.premiumTier
    ? `Level ${guild.premiumTier}`
    : "Tidak ada";
  const boosts = guild.premiumSubscriptionCount || 0;

  const embed = {
    color: 0x5865f2,
    title: `Informasi Server: ${guild.name}`,
    thumbnail: {
      url: guild.iconURL({ dynamic: true }),
    },
    fields: [
      {
        name: "📛 Nama Server",
        value: guild.name,
        inline: true,
      },
      {
        name: "🆔 ID",
        value: guild.id,
        inline: true,
      },
      {
        name: "👑 Pemilik",
        value: `<@${owner.id}>`,
        inline: true,
      },
      {
        name: "📆 Dibuat",
        value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
        inline: true,
      },
      {
        name: "👥 Jumlah Member",
        value: `${guild.memberCount}`,
        inline: true,
      },
      {
        name: "💬 Jumlah Channel",
        value: `${guild.channels.cache.size}`,
        inline: true,
      },
      {
        name: "🎭 Jumlah Role",
        value: `${guild.roles.cache.size}`,
        inline: true,
      },
      {
        name: "🚀 Boost",
        value: `${boosts} Boost (${boostLevel})`,
        inline: true,
      },
    ],
    footer: {
      text: `Server ID: ${guild.id}`,
    },
    timestamp: new Date(),
  };

  return embed;
}
