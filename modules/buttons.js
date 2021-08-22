module.exports = {
    name: 'buttonHandler',
    trigger: 'interaction.button',
    type: 'run'
};

// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, i) => {
    const [type, ...options] = i.customId.split('.');
    const func = client.get(`button.${type}`);
    if (!func || typeof func !== 'function') {
        console.error(`Unknown button type "${type}".`);
        return i.reply({
            content: 'I\'m sorry something went terribly wrong processing your button press. Please try again later.',
            ephemeral: true
        });
    }
    try {
        await func(client, i, options);
    } catch (e) {
        console.error(`${i.user.tag} had an error running button ${i.customId}!`);
        console.error(e);
        i.reply({
            content: `There was an unexpected error processing that button.
If you get support on this error please provide this info: ${'```'}
${e}
${'```'}`, ephemeral: true
        })
            .catch(e => {
                console.error('Error sending button error message!');
                console.error(e);
            });
    }
};