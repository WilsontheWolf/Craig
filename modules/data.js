module.exports = {
    name: 'data',
    trigger: 'load'
};

module.exports.run = (client) => {
    client.getSettings = async (message) => {
        let settings = client.config.settings;
        if (!message.guild) return settings;
        let guildSettings = await client.db.settings.ensure(message.guild.id, {});
        return { ...settings, ...guildSettings };
    };
    client.getLevel = async (message) => {
        let level = 0;
        for (let i = 0; i < client.config.perms.length; i++) {
            let l = client.config.perms[i];
            if (await l.check(message)) level = l.level;
        }
        return level;
    };
};