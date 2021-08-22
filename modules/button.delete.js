module.exports = {
    name: 'button.delete',
    trigger: 'button.delete',
    type: 'get'
};

module.exports.run = () => async (client, i, [author]) => {
    if (author && author !== i.user.id) return i.reply({
        content: 'You did not start this interaction. Please run this command yourself to act on it.',
        ephemeral: true
    });
    await i.deferReply({ ephemeral: true });
    try {
        await i.message.delete();
        await i.editReply('The message was deleted!');
    } catch (e) {
        await i.editReply(`An error occurred deleting that message. Try again later.\`\`\`${e}\`\`\``);
    }
};