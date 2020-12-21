module.exports = {
    name: 'eventLogger',
    trigger: 'logEvent'
};

module.exports.run = (guild, type, content) => {
    const client = guild.client;
    if (!client) return console.debug('Event logger received a guild without a client???');
    if (!type) return console.debug('Event logger received a payload a type???');
    if (!content) return console.debug('Event logger received a payload a content???');
    // const settings = client.getSettingsGuild(guild.id);
    // TODO: Do logic with settings here
    
};