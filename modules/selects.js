module.exports = {
    name: 'selectHandler',
    trigger: 'interaction.select',
    type: 'run'
};

// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, i) => {
    const [type, ...options] = i.customId.split('.');
    const func = client.get(`select.${type}`);
    if (!func || typeof func !== 'function') {
        console.error(`Unknown select type "${type}".`);
        return i.reply({
            content: 'I\'m sorry something went terribly wrong processing your selection. Please try again later.',
            ephemeral: true
        });
    }
    try {
        await func(client, i, options);
    } catch (e) {
        console.error(`${i.user.tag} had an error running select ${i.customId}!`);
        console.error(e);
        i.reply({
            content: `There was an unexpected error processing your selection.
If you get support on this error please provide this info: ${'```'}
${e}
${'```'}`, ephemeral: true
        })
            .catch(e => {
                console.error('Error sending select error message!');
                console.error(e);
            });
    }
};