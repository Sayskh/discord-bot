module.exports = {
  name: 'ping',
  description: 'Ping command to test bot',
  usage: '/ping',
  aliases: ['p'],
  
  // Untuk prefix (!ping)
  async executePrefix(message, args) {
    await message.reply('Pong!');
  },

  // Untuk slash (/ping)
  async executeSlash(interaction) {
    await interaction.reply('Pong!');
  }
};
