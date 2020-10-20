// require all the things
const Discord = require('discord.js');
const Josh = require('josh');
const provider = require('@josh-providers/sqlite');
require('dotenv').config();

// make a client
const client = new Discord.Client({ ws: { intents: Discord.Intents.NON_PRIVILEGED } });

// config and stuff
client.config = require('./config.js');
require('./modules/loading.js')(client);
require('./modules/data.js')(client);
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
    client.loadAllCommands();
    client.loadAllEvents();
    client.login(client.config.token);
})();