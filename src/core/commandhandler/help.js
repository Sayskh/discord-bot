const { EmbedBuilder } = require("discord.js");

function generateHelpMessage(client) {
  const categories = {};

  // Kelompokkan command berdasarkan kategori
  client.commands.forEach((command) => {
    const category = command.category || "Misc";
    if (!categories[category]) categories[category] = [];
    categories[category].push(command.name);
  });

  const embed = new EmbedBuilder()
    .setColor("#3498db")
    .setTitle("📜 List of Commands")
    .setDescription("Berikut adalah semua command yang tersedia:");

  // Tambahkan field untuk setiap kategori
  Object.keys(categories).forEach((category) => {
    const commands = categories[category]
      .sort()
      .map((cmd) => `\`${cmd}\``)
      .join(" ");

    embed.addFields({ name: `📁 ${category}`, value: commands, inline: false });
  });

  return embed;
}

function generateCommandHelp(client, commandName) {
  const command = client.commands.get(commandName);
  if (!command) {
    return new EmbedBuilder()
      .setColor("#e74c3c")
      .setTitle("❌ Command Not Found")
      .setDescription("Perintah yang kamu cari tidak ditemukan.");
  }

  // Format permissions: bisa string, array, atau tidak ada sama sekali
  let permissionsText = "None";
  if (Array.isArray(command.permissions)) {
    permissionsText =
      command.permissions.length > 0 ? command.permissions.join(", ") : "None";
  } else if (typeof command.permissions === "string") {
    permissionsText = command.permissions;
  }

  return new EmbedBuilder()
    .setColor("#2ecc71")
    .setTitle(`🔍 Command: \`${command.name}\``)
    .addFields(
      {
        name: "📖 Description",
        value: command.description || "No description.",
      },
      {
        name: "⏱️ Cooldown",
        value: command.cooldown || "No cooldown.",
      },
      {
        name: "🔒 Permissions",
        value: permissionsText,
      }
    );
}

module.exports = { generateHelpMessage, generateCommandHelp };
