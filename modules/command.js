module.exports = {
    name: 'command',
    trigger: 'event.message'
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args) => {
    const command = args.shift().toLowerCase();

    if (message.guild && !message.member) await message.guild.members.fetch(message.author);

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    if (!cmd) {
        if (!message.guild) return;
        const tag = await client.db.tags.get(`${message.guild.id}-${command}`);
        if (tag) message.channel.send(tag.content, { allowedMentions: { users: [] } });
        return;
    }

    if (!message.guild && cmd.guildOnly)
        return message.channel.send('This command is unavailable via private message. Please run this command in a guild.');

    const level = message.level = await client.getLevel(message);

    if (cmd.level > level) return message.reply(`You don't have the permissions to run this command.
You need to be a ${client.config.perms.find(p => p.level === cmd.level).name} (${cmd.level})
You are a ${client.config.perms.find(p => p.level === level).name} (${level})`);
    message.options = [];
    while (args[0] && args[0][0] === '-') {
        message.options.push(args.shift().slice(1));
    }
    try {
        await cmd.run(client, message, args, level);
    } catch (e) {
        console.error(`${message.author.tag} had an error running command ${command}!`);
        console.error(e);
        message.reply(`There was an unexpected error running that command.
If you get support on this error please provide this info: ${'```'}
${e}
${'```'}`)
            .catch(e => {
                console.error('Error sending error message.');
                console.error(e);
            });
    }
};

module.exports.check = (client, message) => !message.state.ignore && message.state.isCommand;