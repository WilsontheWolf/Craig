module.exports = {
    name: 'select.remind',
    trigger: 'select.remind',
    type: 'get'
};

module.exports.run = () => async (client, i, [type, ...targets]) => {
    if (type === 'msg') {
        let time = parseInt(i.values[0]);
        if (isNaN(time)) return i.reply({
            content: 'I\'m sorry something went wrong there!',
            ephemeral: true
        });
        let url = `https://discord.com/channels/${targets[2] || '@me'}/${targets[1]}/${targets[0]}`;
        const id = await client.get('timer.create', time, {
            type: 'remind',
            msg: `Checkout this message: ${url}`,
            channel: targets[1],
            user: i.author.id
        });
        await i.reply({
            content: `Reminder with id #${id} has been created.`,
            ephemeral: true
        });
    } else i.reply({
        content: 'I\'m sorry something went wrong!',
        ephemeral: true
    });
};