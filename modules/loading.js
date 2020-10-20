/* global unRequire */

const fs = require('fs').promises;

module.exports = (client) => {
    global.unRequire = (file) => {
        if (!file) throw new Error('Please provide a file to un-require.');
        const mod = require.cache[require.resolve(file)];
        delete require.cache[require.resolve(file)];
        for (let i = 0; i < mod.children.length; i++) {
            if (mod.children[i] === mod) {
                mod.children.splice(i, 1);
                break;
            }
        }
    };

    client.loadCommand = (cmd) => {
        try {
            console.log(`Loading command ${cmd}...`);
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
            unRequire(`../commands/${command}.js`);
        } catch (e) {
            return 'Error un-requiring';
        }
        return false;
    };

    client.loadEvent = (evt) => {
        try {
            console.log(`Loading event ${evt}...`);
            const e = require(`../events/${evt}`);
            client.on(evt.split('.')[0], e.bind(null, client));
        } catch (e) {
            console.error(`Error loading event ${evt}:`);
            console.error(e);
            return e;
        }
    };

    client.loadAllEvents = async () => {
        let events = await fs.readdir('./events');
        console.log(`Loading ${events.length} events.`);
        let done = 0;
        events.forEach(evt => {
            if (!evt.endsWith('.js')) return;

            let r = client.loadEvent(evt);
            if (!r) done++;
        });
        console.log(`Successfully loaded ${done}/${events.length} event${events.length !== 1 ? 's' : ''}.`);
    };

    client.unloadEvent = async eventName => {
        if (!client.eventNames().includes(eventName))
            return `The command \`${eventName}\` doesn't seem to exist. Try again!`;
        try {
            unRequire(`../events/${eventName}.js`);
        } catch (e) {
            return 'Error un-requiring';
        }
        return false;
    };

};