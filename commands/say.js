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
    run: async (client, args, data, reply) => {
        reply(args.get('content'), false, 4);
    }
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    message.channel.send(args.join(' '), { allowedMentions: { users: [message.author.id] } });
};