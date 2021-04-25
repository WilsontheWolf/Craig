module.exports = {
    name: 'api.commands',
    trigger: 'api.commands',
    type: 'get'
};
const commandToJSON = ({name, usage, guildOnly, enabled, level, aliases, category, description, moreHelp}) => {
    return {
        name,
        usage,
        guildOnly,
        enabled,
        level,
        aliases,
        category,
        description,
        moreHelp
    };
};

module.exports.run = (client) => {
    return client.commands.map(commandToJSON);
};