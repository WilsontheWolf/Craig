module.exports = {
    name: 'ping',
    usage: '',
    guildOnly: false,
    enabled: true,
    level: 0,
    aliases: [],
    category: 'System',
    description: 'Pong!',
    moreHelp: null
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    let msg = await message.channel.send('Pong!');
    await msg.edit(`🏓 Pong! The latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${client.ws.ping}ms.`);
};