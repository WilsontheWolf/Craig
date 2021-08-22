module.exports = {
    name: 'help',
    usage: '[command name]',
    guildOnly: false,
    enabled: true,
    level: 0,
    aliases: [],
    category: 'Info',
    description: 'Display command info.',
    moreHelp: null
};

const Discord = require('discord.js');

const main = (command, slash, data) => {
    const { client, level } = data;
    if (!command) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.user.username} help.`)
            .setColor('RANDOM');
        if (!slash) embed.setDescription(`My prefix here is \`${data.settings.prefix}\`. For more help on a command run \`${data.settings.prefix}help [command]\`.`);
        else embed.setDescription(`To use commands not supported by slash commands here use the prefix \`${data.settings.prefix}\`. For more help on a command run \`/help command:[command]\`.`);
        const cmds = data.guild ? client.commands.filter(cmd => cmd.level <= level) : client.commands.filter(cmd => cmd.level <= level && cmd.guildOnly !== true);
        let values = {};
        cmds.forEach(cmd => {
            if (!values[cmd.category]) values[cmd.category] = [];
            values[cmd.category].push(cmd);
        });
        embed.addFields(Object.keys(values).map(v => {
            return {
                name: `${v}:`,
                value: values[v].map(c => `**${slash ? c.slash?.supported ? '/' : data.settings.prefix : data.settings.prefix}${c.name} ${c.usage}**
${c.description}`).join('\n'),
                inline: true
            };
        }));
        return { embeds: [embed], ephemeral: true };
    } else {
        let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
        if (!cmd) return { content: `No command found called \`${command}\`. To see all the commands run \`${slash ? '/' : data.settings.prefix}help\`.`, ephemeral: true, allowedMentions: { users: [data.author.id] } };
        const embed = new Discord.MessageEmbed()
            .setTitle(`${cmd.name}:`)
            .setDescription(`**${data.settings.prefix}${cmd.name} ${cmd.usage}**
${cmd.description} ${cmd.moreHelp ? '\n' + cmd.moreHelp : ''}`)
            .addField('Category:', cmd.category, true)
            .addField('Aliases:', cmd.aliases[0] ? `\`${cmd.aliases.join('` `')}\`` : 'none', true)
            .addField('Guild Only:', cmd.guildOnly.toString(), true)
            .setColor('PURPLE');
        return { embeds: [embed], ephemeral: true };
    }
};

// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    const res = main(args[0], false, message);
    await message.channel.send(res);
};

module.exports.slash = {
    supported: true,
    run: async (client, i) => {
        await i.reply(main(i.options.get('command')?.value, true, i));
    }
};