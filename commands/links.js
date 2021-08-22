module.exports = {
    name: 'links',
    usage: '',
    guildOnly: false,
    enabled: true,
    level: 0,
    aliases: [],
    category: 'Misc',
    description: 'Get the various links for Craig.',
    moreHelp: null
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    message.channel.send(`**Links**:
>>> Support: <https://discord.gg/${await client.db.internal.get('supportInvite')}>
Invite: <https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot+applications.commands&permissions=137751622>
GitHub: <https://github.com/WilsontheWolf/Craig>`);
};