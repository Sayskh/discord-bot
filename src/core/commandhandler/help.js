function generateHelpMessage(client) {
  const commandsList = [...client.commands.values()];
  let helpMessage = '**Available Commands:**\n\n';
  for (const command of commandsList) {
    helpMessage += `- \`${command.name}\`: ${command.description || 'No description'}\n`;
  }
  return helpMessage;
}

function generateCommandHelp(client, commandName) {
  const command = client.commands.get(commandName);
  if (!command) return 'Command not found.';

  let helpDetail = `# **${command.name}**\n\n`;
  if (command.aliases) {
    helpDetail += `**Aliases:** ${command.aliases.join(', ')}\n\n`;
  }
  helpDetail += `**Description:** ${command.description || 'No description'}\n\n`;
  helpDetail += `**Usage:** ${command.usage || 'No usage provided.'}\n`;

  return helpDetail;
}

module.exports = { generateHelpMessage, generateCommandHelp };
