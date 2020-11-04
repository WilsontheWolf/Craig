module.exports = {
    name: 'level',
    trigger: 'event:message'
};
const cooldowns = new Set();
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message) => {
    let key = `${message.author.id}-${message.guild.id}`;
    if (cooldowns.has(key)) return;
    if (!message.settings.levelEnabled) return;
    if (message.settings.xpIgnore.includes(message.channel)) return;
    let { level, points } = await client.points.ensure(key, {
        user: message.author.id,
        guild: message.guild.id,
        level: 0,
        points: 0
    });
    let amount = Math.floor((Math.random() + 0.5) * 10);

    points += amount;
    const curLevel = Math.floor(0.1 * Math.sqrt(points));
    if (level < curLevel) {
        message.reply(`You've leveled up to level **${curLevel}**! 🎉`, { allowedMentions: { users: [] } });
    }
    client.points.set(`${key}.level`, curLevel);
    client.points.set(`${key}.points`, points);
    cooldowns.add(key);
    setTimeout(() => cooldowns.delete(key), 60 * 1000);
};

module.exports.check = (client, message) => !message.state.ignore && !message.state.isCommand && message.guild;