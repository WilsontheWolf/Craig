module.exports = {
    name: 'name',
    usage: '<required> [optional]',
    guildOnly: false,
    enabled: true,
    level: 0,
    aliases: [],
    category: 'Misc',
    description: '',
    moreHelp: null
};
const main = async () => {
    // do stuff here
};

module.exports.slash = {
    supported: true,
    // eslint-disable-next-line no-unused-vars
    run: async (client, i) => {
        main();
    }
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    main();
};