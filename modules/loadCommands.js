/* global unRequire */
const Discord = require('discord.js');
const fs = require('fs').promises;

module.exports = {
    name: 'loadCommands',
    type: 'load'
};

// eslint-disable-next-line no-unused-vars
module.exports.run = (client) => {
    client.loadCommand = (cmd) => {
        try {
            let name = cmd.split('.');
            if (name.length !== 1) name.pop();
            name = name.join('.');
            console.info(`Loading command ${name}...`);
            const c = require(`../commands/${cmd}`);
            c.__fileName = `../modules/${cmd}`;
            client.commands.set(c.name, c);
            c.aliases.forEach(a => client.aliases.set(a, c.name));
        } catch (e) {
            console.error(`Error loading command ${cmd}:`);
            console.error(e);
            return e;
        }
    };

    client.loadAllCommands = async () => {
        let commands = await fs.readdir('./commands');
        console.info(`Loading ${commands.length} commands.`);
        let done = 0;
        commands.forEach(cmd => {
            if (!cmd.endsWith('.js')) return;
            let r = client.loadCommand(cmd);
            if (!r) done++;
        });
        console.log(`Successfully loaded ${done}/${commands.length} command${commands.length !== 1 ? 's' : ''}.`);
    };

    client.unloadCommand = async commandName => {
        let command;
        if (client.commands.has(commandName)) {
            command = client.commands.get(commandName);
        } else if (client.aliases.has(commandName)) {
            commandName = client.aliases.get(commandName);
            command = client.commands.get(commandName);
        }
        if (!command)
            return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
        console.info(`Unloading command ${commandName}...`);
        if (command.close) 
            await command.close(client);
        try {
            unRequire(command.__fileName || `../commands/${command.name}.js`);
            command.aliases?.forEach(a => {
                a.delete(a);
            });
            client.commands.delete(commandName);
        } catch (e) {
            console.error(`Error un-requiring ${commandName}\n`, e);
            return 'Error un-requiring';
        }
        return false;
    };

    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection();
    client.loadAllCommands();

};

module.exports.close = async (client) => {
    console.info('Unloading all commands...');
    await Promise.all(client.commands.map(command =>
        client.unloadCommand(command.name)
    ));
    console.log('Unloaded all commands!');
    delete client.loadCommand;
    delete client.loadAllCommands;
    delete client.unloadCommand;
    delete client.commands;
    delete client.aliases;
};