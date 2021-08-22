module.exports = {
    name: 'slashCommand',
    trigger: 'interaction.command'
};

// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, i) => {
    let command = client.commands.get(i.commandName);
    if (!command || !command.slash || !command.slash.supported || !command.slash.run || typeof command.slash.run !== 'function')
        return i.reply({ content: `I'm sorry that command doesn't seem to be supported :V. Please report this error to https://discord.gg/${await client.db.internal.get('supportInvite')}`, ephemeral: true });
    console.debug(`[DEBUG] ${i.user.tag} ran ${i.commandName}.`);
    if (command.level > i.level) return i.reply({
        content: `You don't have the permissions to run this command.
You need to be a ${client.config.perms.find(p => p.level === command.level).name} (${command.level})
You are a ${client.config.perms.find(p => p.level === i.level).name} (${i.level})`, ephemeral: true
    });

    try {
        await command.slash.run(client, i);
    } catch (e) {
        console.error(`${i.user.tag} had an error running slash command ${i.commandName}!`);
        console.error(e);
        i.reply({
            content: `There was an unexpected error running that command.
If you get support on this error please provide this info: ${'```'}
${e}
${'```'}`, ephemeral: true
        })
            .catch(e => {
                console.error('Error sending slash error message!');
                console.error(e);
            });
    }
};
