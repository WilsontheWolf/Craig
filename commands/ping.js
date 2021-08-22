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
module.exports.slash = {
    supported: true,
    // eslint-disable-next-line no-unused-vars
    run: async (client, i) => {
        await i.reply('Pong!');
        const msg = await i.fetchReply();
        await i.editReply(`🏓 Pong! The latency is ${msg.createdTimestamp - i.createdTimestamp}ms. API Latency is ${client.ws.ping}ms.`);
    }
};