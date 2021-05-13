module.exports = {
    name: 'stats',
    usage: '',
    guildOnly: false,
    enabled: true,
    level: 0,
    aliases: [],
    category: 'System',
    description: 'View bot stats.',
    moreHelp: null
};
const { getReadableTime: time } = require('quick-ms');
const Discord = require('discord.js');

const main = (client, data) => {
    return new Discord.MessageEmbed()
        .setTitle('Stats')
        .addField('<:js:525156067743891486>Node.js Version', `${process.version}`, true)
        .addField('<:bot:520718822152470530>Discord.js Version', `${Discord.version}`, true)
        .addField(`🤖${client.user.username} Version`, require('../package.json').version, true)
        .addField('<a:Clock:528295558205538305>Uptime', time(client.uptime), true)
        .addField('💽Memory', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
        .addField(`${client.ws.ping > 200 ? '<a:e:525001588935360522>' : '<a:e:524998745721536514>'}Ping`, `${Math.floor(client.ws.ping)}ms!`, true)
        .addField('👥Users', `~${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} servers.`, true)
        .setFooter(`Requested by ${data.author.tag}`)
        .setTimestamp();
};

module.exports.slash = {
    supported: true,
    run: async (client, args, data, reply) => {
        await reply(main(client, data));
    }
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    await message.channel.send(main(client, message));
};
