const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'leaderboard',
    usage: '',
    guildOnly: true,
    enabled: true,
    level: 0,
    aliases: ['lb'],
    category: 'Leveling',
    description: 'See who has the most xp in your sever.',
    moreHelp: null
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    let data = Object.values(await client.db.points.filter('guild', message.guild.id));
    data = data.sort((a, b) => b.points - a.points);
    if (!data[0]) return message.reply(`I'm sorry it appears that there is no one on the leaderboard. A moderator can enable the points by running \`${message.settings.prefix}conf edit leveling true\`.`);
    const top10 = data.splice(0, 10);
    const embed = new MessageEmbed()
        .setTitle(`${message.guild.name}'s leaderboard.`)
        .setColor('PURPLE');    
    embed.setDescription(top10.map((u, i) => `**#${i + 1}** <@${u.user}>:\nLevel ${u.level}, ${u.points}xp.`).join('\n'));
    await message.channel.send({ embeds: [embed] });
};
