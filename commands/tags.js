module.exports = {
    name: 'tags',
    usage: '[set/tag] [tag] [value]',
    guildOnly: false,
    enabled: true,
    level: 0,
    aliases: ['tag', 'tags'],
    category: 'Misc',
    description: 'Manage and view tags of your server.',
    moreHelp: `\`tags\` - shows all the tags for the server.
\`tags set <tag> <value>\` - change the value of a tag.
\`tags delete <tag>\` - delete a tag.
\`tags raw <tag>\` - view the raw content of a tag for easy copy pasting.
\`tags view <tag>\` - view a tag. 
\`tag <tag>\` - view a tag. Alternately you can just run the tag as a command.`
};

const { escapeMarkdown } = require('discord.js');
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    const list = async (guild) => {
        const tags = await client.db.tags.filter((data) => data.guild === guild);
        if (!Object.values(tags)[0]) return;
        return `\`${Object.values(tags).map((tag) => tag.name).join('`, `')}\``;
    };

    const subCommands = [
        {
            names: ['set', 'edit', 'create', 'add'],
            level: 1, 
            run: async (args) => {
                let [tag, ...content] = args;
                if (!tag) return message.reply('Please include a tag to set.');
                if (tag.includes('.')) return message.reply('Due to an issue with the database you can\'t have `.`\'s in the tag name. Sorry for that');
                content = content.join(' ');
                if (!content) return message.reply('Please include the content of the tag.');
                await client.db.tags.set(`${message.guild.id}-${tag}`, {
                    guild: message.guild.id,
                    name: tag,
                    content
                });
                message.reply(`Successfully set the tag! You can use it by running \`${message.settings.prefix}${tag}\` or \`${message.settings.prefix}tags ${tag}\``, { allowedMentions: { users: [] } });
            }
        },
        {
            names: ['delete', 'remove'],
            level: 1,
            run: async (args) => {
                let tag = args.join(' ');
                if (!tag) message.reply('Please specify a tag to delete.');
                if (!(await client.db.tags.has(`${message.guild.id}-${tag}`))) return message.reply('That tag doesn\'t exist');
                await client.db.tags.delete(`${message.guild.id}-${tag}`);
                message.reply('Successfully deleted the tag!');
            }
        },
        {
            default: false,
            names: ['raw', 'copy'],
            level: 0,
            run: async (args) => {
                let tag;
                if (args[0]) tag = args.join(' ');
                if (!tag) return message.reply('Please choose a tag to get the content of.');
                let data = await client.db.tags.get(`${message.guild.id}-${tag}`);
                if (!data)
                    return message.reply(`I'm sorry no tag found called, ${tag}`, { allowedMentions: { users: [] } });
                message.channel.send(escapeMarkdown(data.content));
            }
        },
        {
            default: true,
            names: ['list', 'view'],
            level: 0,
            run: async (args) => {
                let tag;
                if (args[0]) tag = args.join(' ');
                if (!tag) {
                    const tags = await list(message.guild.id);
                    return message.channel.send(tags ? `**${message.guild.name}'s Tags:**\n${await list(message.guild.id)}` : `There are no tags. You can create one with \`${message.settings.prefix}tag create [tag name] [content]\``,
                        {
                            split: true,
                            allowedMentions: { users: [] }
                        });
                }
                let data = await client.db.tags.get(`${message.guild.id}-${tag}`);
                if (!data)
                    return message.reply(`I'm sorry no tag found called, ${tag}`, { allowedMentions: { users: [] } });
                message.channel.send(data.content);
            }
        }
    ];
    // TODO: Make the a module for usage elsewhere.
    const subCommand = args.shift();
    let command = subCommands.find((v) => v.names.includes(subCommand));
    if (!command) {
        command = subCommands.find((v) => v.default);
        args.unshift(subCommand);
    }
    if (!command || !command.run || typeof command.run !== 'function') return message.reply('I\'m sorry something went wrong.');
    if(command.level < level) return message.reply('You don\'t have the perms to run this subcommand!');
    await command.run(args);
};