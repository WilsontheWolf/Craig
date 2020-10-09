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
    if (!args[0]) {
        let cmds = client.commands.map(c => c.name);
        for(let i = 0; i < cmds.length;i++) await client.unloadCommand(cmds[i]);
        const cmdFiles = await require('fs').promises.readdir('./commands/');
        console.log(`Loading a total of ${cmdFiles.length} commands.`);
        cmdFiles.forEach(f => {
            if (!f.endsWith('.js')) return;
            const response = client.loadCommand(f);
            if (response) console.log(response);
        });
        message.reply('Reloaded all commands.');
    } else {
        let cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
        let response = await client.unloadCommand(cmd.name);
        if (response) return message.reply(`Error Unloading: ${response}`);

        response = client.loadCommand(cmd.name);
        if (response) return message.reply(`Error Loading: ${response}`);

        message.reply(`The command \`${cmd.name}\` has been reloaded`);
    }
};