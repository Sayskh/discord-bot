const { checkCooldown, getRemainingCooldown } = require("../events/cooldown");
require("dotenv").config();

const cooldownMessages = new Map();

module.exports = async (client, message) => {
  const prefix = process.env.PREFIX || "!";

  // Abaikan bot dan pesan yang tidak diawali prefix
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Ambil command dari Map atau dari alias
  const command =
    client.commands.get(commandName) ||
    [...client.commands.values()].find((cmd) =>
      cmd.aliases?.includes(commandName)
    );

  // Kalau command tidak ditemukan, kirim respons error
  if (!command) {
    return message.reply({
      content: `❌ Command \`${commandName}\` tidak ditemukan. Coba \`${prefix}help\` untuk melihat daftar perintah.`,
    });
  }

  try {
    // Cek cooldown
    if (checkCooldown(message.author.id, command)) {
      const timeLeft = getRemainingCooldown(message.author.id, command);
      let secondsLeft = Math.ceil(timeLeft / 1000);

      if (cooldownMessages.has(message.author.id)) {
        const cooldownMsg = cooldownMessages.get(message.author.id);
        await cooldownMsg.edit({
          content: `⏳ Kamu sedang cooldown! Tunggu **${secondsLeft} detik**.`,
        });
      } else {
        const cooldownMsg = await message.reply({
          content: `⏳ Kamu sedang cooldown! Tunggu **${secondsLeft} detik**.`,
          fetchReply: true,
        });

        cooldownMessages.set(message.author.id, cooldownMsg);
      }

      const interval = setInterval(async () => {
        secondsLeft--;
        if (secondsLeft <= 0) {
          clearInterval(interval);
          if (cooldownMessages.has(message.author.id)) {
            const cooldownMsg = cooldownMessages.get(message.author.id);
            await cooldownMsg.delete().catch(() => {});
            cooldownMessages.delete(message.author.id);
          }
        } else {
          const cooldownMsg = cooldownMessages.get(message.author.id);
          await cooldownMsg.edit({
            content: `⏳ Kamu sedang cooldown! Tunggu **${secondsLeft} detik**.`,
          });
        }
      }, 1000);

      return;
    }

    // Jalankan command prefix
    if (command.executePrefix) {
      await command.executePrefix(message, args);
    } else {
      console.error(`Command ${command.name} tidak punya executePrefix.`);
      await message.reply({
        content: "❌ Perintah ini belum tersedia untuk prefix.",
      });
    }
  } catch (error) {
    console.error(error);
    await message.reply({
      content: "❌ Terjadi error saat mengeksekusi perintah.",
    });
  }
};
