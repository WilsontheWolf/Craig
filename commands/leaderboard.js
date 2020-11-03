const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'leaderboard',
    usage: '',
    guildOnly: true,
    enabled: true,
    level: 0,
    aliases: ['lb'],
    category: 'Leveling',
    description: '',
    moreHelp: null
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    let data = Object.values(await client.points.filter('guild', message.guild.id));
    data = data.sort((a, b) => b.points - a.points);
    if (!data[0]) return message.reply('I\'m sorry it appears that there is no one on the leaderboard.');
    const top10 = data.splice(0, 10);
    const embed = new MessageEmbed()
        .setTitle(`${message.guild.name}'s leaderboard.`)
        .setColor('PURPLE');    
    embed.setDescription(top10.map((u, i) => `**#${i + 1}** <@${u.user}>:\nLevel ${u.level}, ${u.points}xp.`).join('\n'));
    message.channel.send(embed);
};