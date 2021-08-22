module.exports = {
    name: 'say',
    usage: '<content>',
    guildOnly: false,
    enabled: true,
    level: 0,
    aliases: [],
    category: 'Misc',
    description: 'Say what you want to say!',
    moreHelp: null
};

module.exports.slash = {
    supported: true,
    run: async (client, i) => {
        i.reply({content: i.options.get('content').value, allowedMentions: { users: [i.author.id]} });
    }
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    message.channel.send({content: args.join(' '), allowedMentions: { users: [message.author.id] } });
};
