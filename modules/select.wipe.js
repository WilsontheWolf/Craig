module.exports = {
    name: 'select.wipe',
    trigger: 'select.wipe',
    type: 'get'
};
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports.run = () => async (client, i, [type, author]) => {
    if (author !== i.user.id) return i.reply({
        content: 'You did not start this interaction. Please run this command yourself to act on it.',
        ephemeral: true
    });
    if (type === 'choose') {
        let choice = i.values[0];
        if (choice === 'guild') {
            if (i.level < 3) return i.reply({
                content: 'You do not seem to have the perms to delete this server\'s settings.',
                ephemeral: true
            });
            i.update({
                content: '**WARNING!:**\n'
                    + 'This will delete all settings and data for your server!',
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId(`wipe.guild.${i.author.id}.no`)
                                .setLabel('No don\'t wipe my server settings.')
                                .setStyle('SUCCESS'),
                            new MessageButton()
                                .setCustomId(`wipe.guild.${i.author.id}.yes`)
                                .setLabel('Yes wipe my server settings.')
                                .setStyle('DANGER')
                        )
                ]
            });
        }
        else if (choice === 'user') {
            i.update({
                content: '**WARNING!:**\n'
                    + 'This will delete all settings and data for your user!',
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId(`wipe.user.${i.author.id}.no`)
                                .setLabel('No, don\'t wipe my user settings.')
                                .setStyle('SUCCESS'),
                            new MessageButton()
                                .setCustomId(`wipe.user.${i.author.id}.yes`)
                                .setLabel('Yes, wipe my user settings.')
                                .setStyle('DANGER')
                        )
                ]
            });
        }
    } else i.reply({
        content: 'I\'m sorry something went wrong!',
        ephemeral: true
    });
};