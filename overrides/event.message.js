// eslint-disable-next-line no-unused-vars
module.exports = async (client, message) => {
    message.state = {
        isCommand: false,
        ignore: true
    };
    if (message.author.bot) return [message];
    const settings = message.settings = await client.getSettings(message);
    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mention)) {
        message.reply(`my prefix${message.guild ? ' on this server' : ''} is \`${settings.prefix}\``);
        return [message];
    }
    message.state.ignore = false;
    const args = message.content.trim().split(/ +/g);

    if (!message.content.startsWith(settings.prefix)) {
        if (args[0].match(mention)) args.shift();
        else return [message];
    } else args[0] = args[0].slice(settings.prefix.length);
    message.state.isCommand = true;
    return [message, args];
};
