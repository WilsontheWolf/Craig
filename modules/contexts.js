module.exports = {
    name: 'contextHandler',
    trigger: 'interaction.context',
    type: 'run'
};

// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, i) => {
    const func = client.get(`context.${i.commandName.toLowerCase().replaceAll(' ', '_')}`);
    if (!func || typeof func !== 'function') {
        console.error(`Unknown context type "${i.commandName}".`);
        return i.reply({
            content: 'I\'m sorry something went terribly wrong processing your command. Please try again later.',
            ephemeral: true
        });
    }
    try {
        await func(client, i);
    } catch (e) {
        console.error(`${i.user.tag} had an error running context ${i.commandName}!`);
        console.error(e);
        i.reply({
            content: `There was an unexpected error processing that command.
If you get support on this error please provide this info: ${'```'}
${e}
${'```'}`, ephemeral: true
        })
            .catch(e => {
                console.error('Error sending context error message!');
                console.error(e);
            });
    }
};