module.exports = {
    name: 'reload',
    usage: '[commands]',
    guildOnly: false,
    enabled: true,
    level: 9,
    aliases: ['refresh'],
    category: 'System',
    description: 'Reload a command.',
    moreHelp: null
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    if (!message.options.includes('e')) {
        if (!args[0]) {
            let cmds = client.commands.map(c => c.name);
            for (let i = 0; i < cmds.length; i++) await client.unloadCommand(cmds[i]);
            await client.loadAllCommands();
            await message.reply('Reloaded all commands.');
        } else {
            let cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
            let response = await client.unloadCommand(cmd.name);
            if (response) return message.reply(`Error Unloading: ${response}`);

            response = client.loadCommand(cmd.name);
            if (response) return message.reply(`Error Loading: ${response}`);

            await message.reply(`The command \`${cmd.name}\` has been reloaded`);
        }
    } else {
        if (!args[0]) {
            let events = client.eventNames();
            for (let i = 0; i < events.length; i++) await client.unloadEvent(events[i]);
            await client.loadAllEvents();
            await message.reply('Reloaded all events.');
        } else {
            let event = args[0];
            let response = await client.unloadEvent(event);
            if (response) return message.reply(`Error Unloading: ${response}`);

            response = client.loadEvent(event);
            if (response) return message.reply(`Error Loading: ${response}`);

            await message.reply(`The event \`${event}\` has been reloaded`);
        }
    }
};