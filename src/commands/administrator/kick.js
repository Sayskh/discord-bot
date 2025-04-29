module.exports = {
  name: 'kick',
  description: 'Kick a member from the server',
  usage: '/kick <user>',
  permissions: ['KickMembers'], // ✅ permission yang benar

  options: [
    {
      name: 'user',
      description: 'User to kick',
      type: 6, // USER
      required: true,
    },
  ],

  async executeSlash(interaction) {
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);

    // ✅ Cek permission yang benar
    if (!interaction.member.permissions.has('KickMembers')) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    if (!member) {
      return interaction.reply({ content: 'User not found.', ephemeral: true });
    }

    if (!member.kickable) {
      return interaction.reply({ content: 'I cannot kick this user. Maybe they have higher role than me?', ephemeral: true });
    }

    await member.kick(`Kicked by ${interaction.user.tag}`);
    await interaction.reply(`${user.tag} has been kicked.`);
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has('KickMembers')) {
      return message.reply('You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('Please mention a user to kick.');
    }

    const member = message.guild.members.cache.get(user.id);
    if (!member) {
      return message.reply('User not found.');
    }

    if (!member.kickable) {
      return message.reply('I cannot kick this user. Maybe they have higher role than me?');
    }

    await member.kick(`Kicked by ${message.author.tag}`);
    await message.reply(`${user.tag} has been kicked.`);
  },
};
