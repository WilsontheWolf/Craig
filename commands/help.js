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
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    if (!args[0]) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.user.username} help.`)
            .setDescription(`My prefix here is \`${message.settings.prefix}\`. For more help on a command run \`${message.settings.prefix}help [command]\`.`)
            .setColor('RANDOM');
        const cmds = message.guild ? client.commands.filter(cmd => cmd.level <= level) : client.commands.filter(cmd => client.level <= level && cmd.conf.guildOnly !== true);
        let values = {};
        cmds.forEach(cmd => {
            if (!values[cmd.category]) values[cmd.category] = [];
            values[cmd.category].push(cmd);
        });
        embed.addFields(Object.keys(values).map(v => {
            return {
                name: `${v}:`,
                value: values[v].map(c => `**${message.settings.prefix}${c.name} ${c.usage}**
${c.description}`).join('\n'),
                inline: true
            };
        }));
        message.channel.send(embed);
    } else {
        let cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
        if (!cmd) return message.reply(`No command found called \`${args[0]}\`. To see all the commands run \`${message.settings.prefix}help\`.`);
        const embed = new Discord.MessageEmbed()
            .setTitle(`${cmd.name}:`)
            .setDescription(`**${message.settings.prefix}${cmd.name} ${cmd.usage}**
${cmd.description} ${cmd.moreHelp ? '\n' + cmd.moreHelp : ''}`)
            .addField('Category:', cmd.category, true)
            .addField('Aliases:', cmd.aliases[0] ? `\`${cmd.aliases.join('` `')}\`` : 'none', true)
            .addField('Guild Only:', cmd.guildOnly, true)
            .setColor('PURPLE');
        message.channel.send(embed);
    }
};