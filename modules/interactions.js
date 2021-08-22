module.exports = {
    name: 'interactionHandler',
    trigger: 'event.interactionCreate'
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, i) => {
    // This saves me from having so many issues with commands.
    i.author = i.user;
    i.settings = await client.getSettings(i);
    i.level = await client.getLevel(i);
    if (i.isCommand())
        client.run('interaction.command', i);
    else if (i.isButton())
        client.run('interaction.button', i);
    else if (i.isSelectMenu())
        client.run('interaction.select', i);
    else if (i.isContextMenu())
        client.run('interaction.context', i);
    else console.debug('Received an unknown interaction type!');
};