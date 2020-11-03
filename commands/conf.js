const Discord = require('discord.js');

module.exports = {
    name: 'conf',
    usage: '[edit/reset/view] [key] [value]',
    guildOnly: true,
    enabled: true,
    level: 2,
    aliases: ['set', 'settings', 'config'],
    category: 'Settings',
    description: 'Manage the settings for your server.',
    moreHelp:
        `\`conf\` - shows all the current settings for the server.
\`conf edit <key> <value>\` - change the value of a setting.
\`conf reset <key>\` - reset the value of a setting to the default.
\`conf view <key>\` - view the current value of a setting.`
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    const info = {
        prefix: {
            name: 'Prefix',
            aliases: ['prefix'],
            desc: 'The prefix is what you must put before a message to use a command.\n' +
                `A user can always use my mention (<@${client.user.id}>) as a prefix.`,
            type: 'string'
        },
        logChannel: {
            name: 'Log Channel',
            aliases: ['log channel', 'logchannel', 'logs', 'log'],
            desc: 'This is the channel in which data is logged.',
            type: 'channel'
        },
        modRole: {
            name: 'Mod Role',
            aliases: ['mod role', 'modrole', 'mods', 'mod'],
            desc: 'Users with this role can perform moderator actions.',
            type: 'role'
        },
        adminRole: {
            name: 'Admin Role',
            aliases: ['admin role', 'adminrole', 'admins', 'admin'],
            desc: 'Users with this role can perform administrator actions.\n' +
                'Users with Manage Server or Administrator permissions also get this.',
            type: 'role'
        },
        support: {
            name: 'Receive Support',
            aliases: ['receive support', 'support'],
            desc: 'When this is enabled, bot support users can access all commands in this server.',
            type: 'bool'
        },
        levelEnabled: {
            name: 'Leveling',
            aliases: ['level', 'xp', 'leveling'],
            desc: `When this is enabled, ${client.user.username} will keep track of xp.`,
            type: 'bool'
        },
        xpIgnore: {
            name: 'Ignored XP Channels',
            aliases: ['ignored xp channels', 'ignored', 'xpignore', 'ignored channels'],
            desc: 'Channels to ignore for xp.',
            type: 'array:channel'
        }
    };

    const parseValue = (value, rich) => {
        if (Array.isArray(value)) {
            if (!value.length) value = 'none';
            else value = value.map(v => parseValue(v, rich)).join(', ');
        }
        if (value == true) value = 'yes';
        if (value == false) value = 'no';
        if (value == undefined) value = 'none';
        if (value.name) value = rich ? value.toString() : value.name;
        return value;
    };

    const getName = (name) => {
        let value = Object.entries(info).find(n => n[1].aliases.includes(name.toLowerCase()));
        if (value) return [value[0], value[1].name];
        return;
    };

    const setValue = async (type, input, old) => {
        let newValue;
        if(type.startsWith('array:')) {
            let [, ...innerType] = type.split(':');
            let v = await setValue(innerType.join(':'), input);
            let index = old.indexOf(v);
            if(!v) return undefined;
            if (index === -1) {
                old.push(v);
            }
            else old.splice(index, 1);
            newValue = old;
        }
        if (type == 'string')
            newValue = input;
        if (type == 'bool') {
            let trueStrings = ['true', 'yes', 't', 'y'];
            let falseStrings = ['false', 'no', 'f', 'n'];
            if (trueStrings.includes(input.toLowerCase())) newValue = true;
            if (falseStrings.includes(input.toLowerCase())) newValue = false;
        }
        if (type == 'role') newValue = await client.searchRole(input, message);
        if (type == 'channel') newValue = await client.searchChannel(input, message, 'text');
        return newValue;
    };

    let settings = message.settings;
    if (!args[0]) {
        let set = Object.keys(settings).map(s => {
            let value = settings[s];
            value = parseValue(value, true);
            let name = getName(s);
            name = name ? name[1] : s;
            return { value, name: name + ':', inline: true };
        });
        const embed = new Discord.MessageEmbed()
            .setTitle(`${message.guild.name} settings:`)
            .setColor('GOLD')
            .addFields(set);
        return message.channel.send(embed);
    }
    let subCommand = args.shift();
    if (subCommand == 'view') {
        let view = args.join(' ');
        let name = getName(view);
        view = name ? name[0] : view;
        name = name ? name[1] : view;
        if (!view) return message.reply('please insert a value for setting.');
        let value = message.settings[view];
        if (value === undefined) return message.reply(`no setting found called \`${view}\`!`);
        value = parseValue(value, true);
        let desc = info[view].desc || 'There is no info for this setting.';
        const embed = new Discord.MessageEmbed()
            .setTitle(name)
            .setDescription(desc)
            .addField('Current Value:', value)
            .setColor('GOLD');
        return message.channel.send(embed);
    }
    if (subCommand == 'edit') {
        let setting = args.shift();
        let name = getName(setting);
        setting = name ? name[0] : setting;
        name = name ? name[1] : setting;
        let value = settings[setting];
        if (value === undefined) return message.reply(`no setting found called \`${setting}\`!`);
        let type = info[setting].type || 'string';
        let input = args.join(' ');
        if (!input) return message.reply('please choose a value to set to.');
        let newValue = await setValue(type, input, value);
        if (newValue === undefined) return message.reply(`invalid new value for ${name}!`);
        await client.settings.set(`${message.guild.id}.${setting}`, newValue);
        return message.channel.send(`Successfully set new value for ${name} to ${parseValue(newValue, true)}.`, { allowedMentions: { users: [] } });
    }
    if (subCommand == 'reset') {
        let setting = args.join(' ');
        let name = getName(setting);
        setting = name ? name[0] : setting;
        name = name ? name[1] : setting;
        let value = settings[setting];
        if (value === undefined) return message.reply(`no setting found called \`${setting}\`!`);
        await client.settings.delete(`${message.guild.id}.${setting}`);
        return message.channel.send(`Successfully set new value for ${name} to the default.`);
    }
};