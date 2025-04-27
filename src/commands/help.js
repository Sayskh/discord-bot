const { generateHelpMessage, generateCommandHelp } = require('../core/commandhandler/help');

module.exports = {
    name: 'help',
    description: 'List all commands or get detailed info about a command',
    options: [
        {
            name: 'command',
            type: 3, // STRING
            description: 'The command to get help for',
            required: false,
            choices: [
                { name: 'ping', value: 'ping' },
                { name: 'avatar', value: 'avatar' },
                // Tambahkan semua command kamu di sini
            ]
        }
    ],
    async executeSlash(interaction) {
        const commandName = interaction.options.getString('command');
        if (!commandName) {
            interaction.reply({ content: generateHelpMessage(interaction.client), ephemeral: true });
        } else {
            interaction.reply({ content: generateCommandHelp(interaction.client, commandName.toLowerCase()), ephemeral: true });
        }
    },
    async executePrefix(message, args) {
        if (args.length === 0) {
            message.channel.send(generateHelpMessage(message.client));
        } else {
            message.channel.send(generateCommandHelp(message.client, args[0].toLowerCase()));
        }
    }
};
