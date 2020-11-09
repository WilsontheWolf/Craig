module.exports = {
    name: 'ready',
    trigger: 'event.ready'
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client) => {
    console.log(`Connected as ${client.user.tag} (${client.user.id})`);
    console.info(`I'm in ${client.guilds.cache.size} guilds, with ${client.channels.cache.size} channels and ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} users.`);

    client.user.setActivity(`for @${client.user.username} help`, { type: 'WATCHING' });
    // ensure the internal db has the important stuff
    client.internal.ensure('support', []);

    // loop the status cause it likes vanishing
    setInterval(() => {
        client.user.setActivity(`for @${client.user.username} help`, { type: 'WATCHING' });
    }, 5 * 60 * 1000);
};