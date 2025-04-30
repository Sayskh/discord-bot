const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "clear",
  description: "Delete a number of messages (1–100)",
  usage: "!clear <jumlah>",
  permissions: ["ManageMessages"],
  cooldown: "3s",

  options: [
    {
      name: "jumlah",
      description: "Jumlah pesan yang ingin dihapus (1–100)",
      type: 4, // INTEGER
      required: true,
    },
  ],

  async executeSlash(interaction) {
    const jumlah = interaction.options.getInteger("jumlah");
    const member = interaction.member;

    if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({
        content: "❌ You don't have permission to manage messages.",
        ephemeral: true,
      });
    }

    if (jumlah < 1 || jumlah > 100) {
      return interaction.reply({
        content: "❌ Masukkan angka antara 1 sampai 100.",
        ephemeral: true,
      });
    }

    try {
      const deleted = await interaction.channel.bulkDelete(jumlah, true);
      await interaction.reply({
        content: `✅ Berhasil menghapus ${deleted.size} pesan.`,
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content:
          "❌ Gagal menghapus pesan. Mungkin pesan terlalu lama (>14 hari).",
        ephemeral: true,
      });
    }
  },

  async executePrefix(message, args) {
    const jumlah = parseInt(args[0]);

    if (
      !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)
    ) {
      return message.channel.send(
        "❌ You don't have permission to manage messages."
      );
    }

    if (isNaN(jumlah) || jumlah < 1 || jumlah > 100) {
      return message.channel.send("❌ Masukkan angka antara 1 sampai 100.");
    }

    try {
      const deleted = await message.channel.bulkDelete(jumlah, true);
      await message.channel.send(
        `✅ Berhasil menghapus ${deleted.size} pesan.`
      );
    } catch (err) {
      console.error(err);
      await message.channel.send(
        "❌ Gagal menghapus pesan. Mungkin pesan terlalu lama (>14 hari)."
      );
    }
  },
};
