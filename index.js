// require all the things
const Discord = require('discord.js');
const fs = require('fs').promises;
const Josh = require('josh');
const provider = require('@josh-providers/sqlite');
require('dotenv').config();

// make a client
const client = new Discord.Client({ ws: { intents: Discord.Intents.NON_PRIVILEGED } });

// config and stuff
client.config = require('./config.js');
require('./modules/functions.js')(client);
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// db stuff
client.settings = new Josh({
    name: 'settings',
    provider,
    serializer: (data, key, path) => {
        if (!path) data = {
            ...data,
            logChannel: data.logChannel ? data.logChannel.id : null,
            modRole: data.modRole ? data.modRole.id : null,
            adminRole: data.adminRole ? data.adminRole.id : null
        };
        if (['logChannel', 'adminRole', 'modRole'].includes(path)) data = data ? data.id : null;
        return data;
    }
    ,
    deserializer: (data, guild) => {
        return {
            ...data,
            logChannel: data.logChannel ? client.guilds.cache.get(guild).channels.cache.get(data.logChannel) : null,
            modRole: data.modRole ? client.guilds.cache.get(guild).roles.cache.get(data.modRole) : null,
            adminRole: data.adminRole ? client.guilds.cache.get(guild).roles.cache.get(data.adminRole) : null
        };
    },
});
client.internal = new Josh({
    name: 'internal',
    provider,
});

(async () => {
    let commands = await fs.readdir('./commands');
    console.log(`Loading ${commands.length} commands.`);
    let done = 0;
    commands.forEach(cmd => {
        if (!cmd.endsWith('.js')) return;
        let r = client.loadCommand(cmd);
        if (!r) done++;
    });
    console.log(`Successfully loaded ${done}/${commands.length} command${commands.length !== 1 ? 's' : ''}.`);
    let events = await fs.readdir('./events');
    console.log(`Loading ${events.length} events.`);
    done = 0;
    events.forEach(evt => {
        if (!evt.endsWith('.js')) return;

        let r = client.loadEvent(evt);
        if (!r) done++;
    });
    console.log(`Successfully loaded ${done}/${events.length} event${events.length !== 1 ? 's' : ''}.`);
    client.login(client.config.token);
})();