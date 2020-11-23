// todo make this much more modular
const Josh = require('josh');
const provider = require('@josh-providers/sqlite');

module.exports = {
    name: 'db',
    trigger: 'load'
};

module.exports.run = (client) => {
    client.db.settings = new Josh({
        name: 'settings',
        provider,
        serializer: (data, key, path) => {
            if (!path) data = {
                ...data,
                logChannel: data.logChannel ? data.logChannel.id : null,
                modRole: data.modRole ? data.modRole.id : null,
                adminRole: data.adminRole ? data.adminRole.id : null,
                xpIgnore: data.xpIgnore ? data.xpIgnore.map(c => c.id) : []
            };
            if (['logChannel', 'adminRole', 'modRole'].includes(path)) data = data ? data.id : null;
            if(path === 'xpIgnore') data = data ? data.map(c => c.id): [];
            return data;
        }
        ,
        deserializer: (data, guild) => {
            return {
                ...data,
                logChannel: data.logChannel ? client.guilds.cache.get(guild).channels.cache.get(data.logChannel) : null,
                modRole: data.modRole ? client.guilds.cache.get(guild).roles.cache.get(data.modRole) : null,
                adminRole: data.adminRole ? client.guilds.cache.get(guild).roles.cache.get(data.adminRole) : null,
                xpIgnore: data.xpIgnore ? data.xpIgnore.map(id => client.guilds.cache.get(guild).channels.cache.get(id)) : []
            };
        },
    });
    client.db.internal = new Josh({
        name: 'internal',
        provider,
    });
    client.db.points = new Josh({
        name: 'points',
        provider,
    });
};