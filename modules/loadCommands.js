/* global unRequire */
const Discord = require('discord.js');
const fs = require('fs').promises;

module.exports = {
    name: 'loadCommands',
    trigger: 'load'
};

// eslint-disable-next-line no-unused-vars
module.exports.run = (client) => {
    client.loadCommand = (cmd) => {
        try {
            let name = cmd.split('.');
            name.pop();
            name = name.join('.');
            console.log(`Loading command ${name}...`);
            const c = require(`../commands/${cmd}`);
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
        console.log(`Loading ${commands.length} commands.`);
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
            command = client.commands.get(client.aliases.get(commandName));
        }
        if (!command)
            return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
        if (command.shutdown) {
            await command.shutdown(client);
        }
        try {
            unRequire(`../commands/${command.name}.js`);
        } catch (e) {
            return 'Error un-requiring';
        }
        return false;
    };

    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection();
    client.loadAllCommands();

};