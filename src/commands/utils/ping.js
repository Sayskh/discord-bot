module.exports = {
  name: "ping",
  description: "Cek latensi bot (message latency)",
  usage: "/ping",
  aliases: ["p"],
  cooldown: "5s",

  async executePrefix(message) {
    const sent = await message.reply("Pinging...");
    const latency = sent.createdTimestamp - message.createdTimestamp;

    const embed = {
      color: 0x00ff99,
      title: `🏓 Pong!`,
      description: `Latency: **${latency}ms**`,
      footer: {
        text: `Requested by ${message.author.tag}`,
        icon_url: message.author.displayAvatarURL({ dynamic: true }),
      },
      timestamp: new Date(),
    };

    await sent.edit({ content: null, embeds: [embed] });
  },

  async executeSlash(interaction) {
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;

    const embed = {
      color: 0x00ff99,
      title: `🏓 Pong!`,
      description: `Latency: **${latency}ms**`,
      footer: {
        text: `Requested by ${interaction.user.tag}`,
        icon_url: interaction.user.displayAvatarURL({ dynamic: true }),
      },
      timestamp: new Date(),
    };

    await interaction.editReply({ content: null, embeds: [embed] });
  },
};
