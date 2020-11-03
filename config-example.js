const config = {
    // The owners id. By default the owner has all the permissions.
    ownerID: '1234567890',
    // The Co-Owner's ids. By default the co-owners also have all the permissions.
    coOwnersIDs: [],

    // The token for bot login
    token: process.env.token,
    // The default settings for the servers
    settings: {
        prefix: '~',
        logChannel: null,
        modRole: null,
        adminRole: null,
        support: false,
        levelEnabled: false,
        xpIgnore: []
    },

    perms: [
        {
            level: 0,
            name: 'User',
            check: () => {
                return true;
            }
        },
        {
            level: 1,
            name: 'Moderator',
            check: (message) => {
                try {
                    if (message.member.roles.cache.has(message.settings.modRole)) return true;
                    return false;
                } catch (e) {
                    return false;
                }
            }
        },
        {
            level: 2,
            name: 'Administrator',
            check: (message) => {
                try {
                    if (message.member.permissions.has('MANAGE_GUILD')) return true;
                    if (message.member.roles.cache.has(message.settings.adminRole)) return true;
                    return false;
                } catch (e) {
                    return false;
                }
            }
        },
        {
            level: 3,
            name: 'Server Owner',
            check: (message) => {
                try {
                    if (message.guild.ownerID === message.author.id) return true;
                    return false;
                } catch (e) {
                    return false;
                }
            }
        },
        {
            level: 4,
            name: 'Bot Support',
            check: async (message) => {
                try {
                    if (message.settings.support && (await message.client.internal.get('support').includes(message.author.id))) return true;
                    return false;
                } catch (e) {
                    return false;
                }
            }
        },
        {
            level: 9,
            name: 'Bot Co-Owner',
            check: async (message) => {
                return config.coOwnersIDs.includes(message.author.id);
            }
        },
        {
            level: 10,
            name: 'Bot Owner',
            check: async (message) => {
                return config.ownerID == message.author.id;
            }
        },
    ]
};

module.exports = config;