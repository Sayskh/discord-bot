// core/events/interactionCreate.js
module.exports = async (client, interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    if (command.executeSlash) {
      await command.executeSlash(interaction);
    } else {
      console.error(`Command ${interaction.commandName} tidak punya executeSlash.`);
    }
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error trying to execute that command!', ephemeral: true });
  }
};
