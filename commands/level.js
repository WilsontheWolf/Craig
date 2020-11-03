module.exports = {
    name: 'level',
    usage: '[member]',
    guildOnly: true,
    enabled: true,
    level: 0,
    aliases: ['xp'],
    category: 'Leveling',
    description: 'See your current xp.',
    moreHelp: null
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    let user = message.author;
    if(args[0]) user = await client.searchUser(args.join(' '), message);
    if(!user) return message.reply('Please choose a valid user.');
    if(user.bot) return message.reply('Bots can\'t get xp.');
    let data = await client.points.get(`${user.id}-${message.guild.id}`);
    if(!data) return message.reply('This user is not registered yet.');
    else message.channel.send(`${user.id === message.author.id ? 'You are' : `${user.username} is`} level ${data.level} with ${data.points}xp.`);
};