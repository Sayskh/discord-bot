const { REST, Routes } = require("discord.js");
require("dotenv").config();

async function registerSlashCommands(client) {
  const commands = [];

  for (const command of client.commands.values()) {
    const data = {
      name: command.name,
      description: command.description || "No description provided.",
      options: command.options || [],
    };

    commands.push(data);
  }

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    console.log("🔄 Registering slash commands...");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });

    console.log("✅ Slash commands registered successfully.");
  } catch (error) {
    console.error("❌ Error registering slash commands:", error);
  }
}

module.exports = { registerSlashCommands };
