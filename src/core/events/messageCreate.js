// core/events/messageCreate.js
module.exports = async (client, message) => {
  if (message.author.bot) return;
  
  const prefix = process.env.PREFIX || '!';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    if (command.executePrefix) {
      await command.executePrefix(message, args);
    } else {
      console.error(`Command ${commandName} tidak punya executePrefix.`);
    }
  } catch (error) {
    console.error(error);
    if (!message.replied) {
      message.reply('There was an error trying to execute that command!');
    }
  }
};
