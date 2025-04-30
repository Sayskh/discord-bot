const { checkCooldown, getRemainingCooldown } = require("../events/cooldown");

const cooldownMessages = new Map();

module.exports = async (client, interaction) => {
  // Autocomplete handler (contoh: untuk command help)
  if (interaction.isAutocomplete()) {
    if (interaction.commandName === "help") {
      const focused = interaction.options.getFocused();
      const choices = [...client.commands.keys()];
      const filtered = choices
        .filter((cmd) => cmd.startsWith(focused))
        .slice(0, 25);

      return interaction.respond(
        filtered.map((cmd) => ({ name: cmd, value: cmd }))
      );
    }
    return; // Stop di sini untuk autocomplete
  }

  // Cek kalau bukan slash command
  if (!interaction.isCommand()) return;

  // Ambil command dari Map
  const command = client.commands.get(interaction.commandName);

  // Jika command tidak ditemukan, beri pesan kesalahan

  try {
    // Cek cooldown
    if (checkCooldown(interaction.user.id, command)) {
      const timeLeft = getRemainingCooldown(interaction.user.id, command);
      let secondsLeft = Math.ceil(timeLeft / 1000);

      if (cooldownMessages.has(interaction.user.id)) {
        const cooldownMsg = cooldownMessages.get(interaction.user.id);
        await cooldownMsg.edit({
          content: `⏳ Kamu sedang cooldown! Tunggu **${secondsLeft} detik**.`,
        });
      } else {
        const cooldownMsg = await interaction.reply({
          content: `⏳ Kamu sedang cooldown! Tunggu **${secondsLeft} detik**.`,
          fetchReply: true,
        });

        cooldownMessages.set(interaction.user.id, cooldownMsg);
      }

      const interval = setInterval(async () => {
        secondsLeft--;
        if (secondsLeft <= 0) {
          clearInterval(interval);
          if (cooldownMessages.has(interaction.user.id)) {
            const cooldownMsg = cooldownMessages.get(interaction.user.id);
            await cooldownMsg.delete().catch(() => {});
            cooldownMessages.delete(interaction.user.id);
          }
        } else {
          const cooldownMsg = cooldownMessages.get(interaction.user.id);
          await cooldownMsg.edit({
            content: `⏳ Kamu sedang cooldown! Tunggu **${secondsLeft} detik**.`,
          });
        }
      }, 1000);

      return;
    }

    if (command.executeSlash) {
      await command.executeSlash(interaction);
    } else {
      console.error(`Command ${command.name} tidak punya executeSlash.`);
      await interaction.reply({
        content: "❌ Perintah ini belum tersedia sebagai slash command.",
      });
    }
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "❌ Terjadi kesalahan saat menjalankan perintah.",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "❌ Terjadi kesalahan saat menjalankan perintah.",
        ephemeral: true,
      });
    }
  }
};
