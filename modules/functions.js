module.exports = (client) => {
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
        const mod = require.cache[require.resolve(`../commands/${command.name}`)];
        delete require.cache[require.resolve(`../commands/${command.name}.js`)];
        for (let i = 0; i < mod.parent.children.length; i++) {
            if (mod.parent.children[i] === mod) {
                mod.parent.children.splice(i, 1);
                break;
            }
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
    client.getSettings = async (message) => {
        let settings = client.config.settings;
        if (!message.guild) return settings;
        let guildSettings = await client.settings.ensure(message.guild.id, {});
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
            } catch (e) {
                //ignore errors
            }
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
            console.log(users.length);
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
            console.log(users.length);
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
            console.log(roles.length);
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
            console.log(roles.length);
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
        await msg.channel.send(question, {allowedMentions: {users: []}});
        try {
            const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
            return collected.first().content;
        } catch (e) {
            return false;
        }
    };
};