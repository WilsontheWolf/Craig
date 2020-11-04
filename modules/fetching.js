module.exports = {
    name: 'fetching',
    trigger: 'load'
};

module.exports.run = (client) => {
    client.fetchUser = async (query) => {
        const mention = new RegExp(/<@!?(\d+)>/);
        let match = query.match(mention);
        let user = query;
        let result;
        if (match) user = match[1];
        try {
            result = await client.users.fetch(user);
        } catch (e) {
            //ignore errors
        }
        return result;

    };

    client.searchUser = async (search, msg) => {
        let result = await client.fetchUser(search);
        if (result && msg.guild) {
            try {
                result = await msg.guild.members.fetch(search);
            } catch (e) {}
        }
        if (result) return result;
        if (msg.guild) if (
            msg.guild.members.cache
                .filter(user =>
                    user.displayName.toLowerCase().startsWith(search.toLowerCase())
                )
                .first()
        ) {
            let users = msg.guild.members.cache
                .filter(user =>
                    user.displayName.toLowerCase().startsWith(search.toLowerCase())
                )
                .array();
            if (users.length == 1) return users[0].user;
            let question = '';
            for (let i = 0; i != users.length && i != 10; i++) {
                question =
                    question +
                    `[${i + 1}] ${users[i].displayName} (${users[i].user.tag})
`;
            }
            let num = await client.awaitReply(
                msg,
                `Please choose one of these:
${question}`
            );
            return users[parseInt(num) - 1].user;
        }
        if (
            client.users.cache
                .filter(user =>
                    user.username.toLowerCase().startsWith(search.toLowerCase())
                )
                .first()
        ) {
            let users = client.users.cache
                .filter(user =>
                    user.username.toLowerCase().startsWith(search.toLowerCase())
                )
                .array();
            if (users.length == 1) return users[0];
            let question = '';
            for (let i = 0; i != users.length && i != 10; i++) {
                question =
                    question +
                    `[${i + 1}] ${users[i].tag}
`;
            }
            let num = await client.awaitReply(
                msg,
                `Please choose one of these:
${question}`
            );
            return users[parseInt(num) - 1];
        }
    };

    client.fetchRole = async (query, guild) => {
        const mention = new RegExp(/<@&(\d+)>/);
        let match = query.match(mention);
        let role = query;
        let result;
        if (match) role = match[1];
        try {
            result = await guild.roles.fetch(role);
        } catch (e) {
            //ignore errors
        }
        return result;
    };

    client.searchRole = async (search, msg) => {
        let result = await client.fetchRole(search, msg.guild);
        if (result) return result;
        if (
            msg.guild.roles.cache
                .filter(role =>
                    role.name.toLowerCase().startsWith(search.toLowerCase())
                )
                .first()
        ) {
            let roles = msg.guild.roles.cache
                .filter(role =>
                    role.name.toLowerCase().startsWith(search.toLowerCase())
                )
                .array();
            if (roles.length == 1) return roles[0];
            let question = '';
            for (let i = 0; i != roles.length && i != 10; i++) {
                question =
                    question +
                    `[${i + 1}] ${roles[i].name}
`;
            }
            let num = await client.awaitReply(
                msg,
                `Please choose one of these:
${question}`
            );
            return roles[parseInt(num) - 1];
        }
    };

    client.fetchChannel = (query, guild) => {
        const mention = new RegExp(/<#(\d+)>/);
        let match = query.match(mention);
        let channel = query;
        let result;
        if (match) channel = match[1];
        try {
            result = guild.channels.cache.get(channel);
        } catch (e) {
            //ignore errors
        }
        return result;
    };

    client.searchChannel = async (search, msg, type) => {
        let result = await client.fetchChannel(search, msg.guild);
        if (result && (type ? type == result.type : true)) return result;
        if (
            msg.guild.channels.cache
                .some(role =>
                    role.name.toLowerCase().startsWith(search.toLowerCase()) && (type ? type == role.type : true)
                )
        ) {
            let roles = msg.guild.channels.cache
                .filter(role =>
                    role.name.toLowerCase().startsWith(search.toLowerCase()) && (type ? type == role.type : true)
                )
                .array();
            if (roles.length == 1) return roles[0];
            let question = '';
            for (let i = 0; i != roles.length && i != 10; i++) {
                question =
                    question +
                    `[${i + 1}] ${roles[i].name}
`;
            }
            let num = await client.awaitReply(
                msg,
                `Please choose one of these:
${question}`
            );
            return roles[parseInt(num) - 1];
        }
    };

    // stolen from GuideBot
    client.awaitReply = async (msg, question, limit = 60000) => {
        const filter = m => m.author.id === msg.author.id;
        await msg.channel.send(question, { allowedMentions: { users: [] } });
        try {
            const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
            return collected.first().content;
        } catch (e) {
            return false;
        }
    };
};