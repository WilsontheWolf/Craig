module.exports = [
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
                if (message.member.roles.cache.has(message.settings.modRole.id)) return true;
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
                if (message.member.roles.cache.has(message.settings.adminRole.id)) return true;
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
                if (message.guild.ownerID === (message.author?.id || message.user?.id)) return true;
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
                if (message.settings.support && (await message.client.internal.get('support').includes(message.author?.id || message.user?.id))) return true;
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
            return message.client.config.coOwnersIDs.includes(message.author?.id || message.user?.id);
        }
    },
    {
        level: 10,
        name: 'Bot Owner',
        check: async (message) => {
            return message.client.config.ownerID == (message.author?.id || message.user?.id);
        }
    },
];