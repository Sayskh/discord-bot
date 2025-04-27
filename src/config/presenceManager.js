const { ActivityType } = require('discord.js');
const config = require('./config.json');

module.exports = async (client) => {
  try {
    await client.user.setPresence({
      activities: [{
        name: config.status,
        type: ActivityType.Watching
      }],
      status: 'dnd',
    });
  } catch (error) {
    console.error('Error setting presence:', error);
  }
};
