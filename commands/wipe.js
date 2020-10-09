module.exports = {
    name: 'wipe',
    usage: '',
    guildOnly: true,
    enabled: true,
    level: 3,
    aliases: [],
    category: 'Settings',
    description: 'Wipe all data related to your server.',
    moreHelp: null
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    let reply = await client.awaitReply(message, 'WARNING!!!:\n'
        + 'This will delete all settings for your server!!!!\n'
        + 'If you are sure about this send `confirm`. If not send `cancel`.');
    if (reply == 'confirm') {
        await client.settings.delete(message.guild.id);
        message.reply('Successfully deleted your servers settings!');
    } else message.reply('Canceled. Your setting have not been deleted.');
};