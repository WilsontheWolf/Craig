module.exports = {
    name: 'reboot',
    usage: '',
    guildOnly: false,
    enabled: true,
    level: 9,
    aliases: ['restart', 'shutdown'],
    category: 'System',
    description: 'Shut down the bot.',
    moreHelp: null
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    await message.reply('rebooting...');
    process.exit();
};