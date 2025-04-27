module.exports = {
    name: 'avatar',
    description: 'Displays user avatar',
    usage: '/avatar [user]',
    aliases: ['av', 'pfp'],
  
    options: [
      {
        name: 'user',
        description: 'User to get avatar',
        type: 6, // 6 = User (USER type)
        required: false
      }
    ],
  
    async executePrefix(message, args) {
      const user = message.mentions.users.first() || message.author;
      await message.reply(user.displayAvatarURL({ dynamic: true, size: 512 }));
    },
  
    async executeSlash(interaction) {
      const user = interaction.options.getUser('user') || interaction.user;
      await interaction.reply(user.displayAvatarURL({ dynamic: true, size: 512 }));
    }
  };
  