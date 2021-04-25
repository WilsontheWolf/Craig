module.exports = {
    name: 'subcommand',
    type: 'load'
};

module.exports.run = (client) => {
    client.subCommand = (args, level, subCommands) => {
        const subCommand = args.shift();
        let command = subCommands.find((v) => v.names.includes(subCommand));
        if (!command) {
            command = subCommands.find((v) => v.default);
            args.unshift(subCommand);
        }
        if (!command || !command.run || typeof command.run !== 'function') throw new Error('Unable to run command!');
        if (command.level > level) return 'You don\'t have the perms to run this subcommand!';
        command.run(args);
    };
};

module.exports.close = (client) => {
    delete client.subCommand;
};