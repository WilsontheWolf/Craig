module.exports = {
    name: 'remind',
    usage: '<time> [message]',
    guildOnly: false,
    enabled: true,
    level: 0,
    aliases: [],
    category: 'Misc',
    description: 'Get a reminder.',
    moreHelp: null
};
const { getMilliseconds: time } = require('quick-ms');

// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    if (!args[0]) return message.reply('Please specify a duration.');
    let dur;
    try {
        dur = time(args.shift());
    } catch (e) {
        return message.reply('Please choose a valid duration.');
    }
    const msg = args.join(' ') || 'No message specified.';
    const id = await client.get('timer.create', dur, {
        type: 'remind',
        msg,
        channel: message.channel.id,
        user: message.author.id
    });
    await message.reply(`Reminder with id #${id} has been created.`);
};