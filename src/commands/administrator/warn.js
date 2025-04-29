const userWarnings = new Map(); // sementara, pakai memory

module.exports = {
  name: 'warn',
  description: 'Warn a user. 3 warns = timeout',
  usage: '/warn <user> [reason]',
  options: [
    {
      name: 'user',
      type: 6, // USER
      description: 'User to warn',
      required: true,
    },
    {
      name: 'reason',
      type: 3, // STRING
      description: 'Reason for the warning',
      required: false,
    }
  ],

  async executeSlash(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason';
    const member = interaction.guild.members.cache.get(user.id);

    if (!interaction.member.permissions.has('ModerateMembers')) {
      return interaction.reply({ content: 'You lack permission.', ephemeral: true });
    }

    if (!member) return interaction.reply({ content: 'User not found.', ephemeral: true });

    // Tambah warning ke memory
    const warnings = userWarnings.get(user.id) || 0;
    const newWarnings = warnings + 1;
    userWarnings.set(user.id, newWarnings);

    // DM user
    try {
      await user.send(`You have been warned in **${interaction.guild.name}**. Reason: ${reason}. Total warnings: ${newWarnings}`);
    } catch {}

    if (newWarnings >= 3) {
      // Timeout (mute) user selama 10 menit
      const timeoutMs = 10 * 60 * 1000;
      try {
        await member.timeout(timeoutMs, `Auto-timeout after 3 warnings.`);
        await interaction.reply(`${user.tag} has been warned and timed out for 10 minutes.`);
      } catch (err) {
        return interaction.reply({ content: 'Failed to timeout user.', ephemeral: true });
      }
    } else {
      await interaction.reply(`${user.tag} has been warned. (${newWarnings}/3)`);
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has('ModerateMembers')) return message.reply('You lack permission.');

    const user = message.mentions.users.first();
    const reason = args.slice(1).join(' ') || 'No reason';
    if (!user) return message.reply('Please mention a user.');

    const member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply('User not found.');

    const warnings = userWarnings.get(user.id) || 0;
    const newWarnings = warnings + 1;
    userWarnings.set(user.id, newWarnings);

    try {
      await user.send(`You have been warned in **${message.guild.name}**. Reason: ${reason}. Total warnings: ${newWarnings}`);
    } catch {}

    if (newWarnings >= 3) {
      const timeoutMs = 10 * 60 * 1000;
      try {
        await member.timeout(timeoutMs, `Auto-timeout after 3 warnings.`);
        await message.reply(`${user.tag} has been warned and timed out for 10 minutes.`);
      } catch {
        return message.reply('Failed to timeout user.');
      }
    } else {
      message.reply(`${user.tag} has been warned. (${newWarnings}/3)`);
    }
  }
};
