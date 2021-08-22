module.exports = {
    name: 'wipe',
    usage: '',
    guildOnly: false,
    enabled: true,
    level: 0,
    aliases: [],
    category: 'Settings',
    description: 'Wipe all data related to your server or user.',
    moreHelp: null
};

const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    // In DM or unable to process data
    if(!message.guild || level < 3) 
        message.reply({
            content: '**WARNING!:**\n'
                + 'This will delete all settings and data for your user!',
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`wipe.user.${message.author.id}.no`)
                            .setLabel('No, don\'t wipe my user settings.')
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId(`wipe.user.${message.author.id}.yes`)
                            .setLabel('Yes, wipe my user settings.')
                            .setStyle('DANGER')
                    )
            ],
            ephemeral: true
        });
    else message.reply({
        content: 'Please select what your want to remove data from',
        components: [
            new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`wipe.choose.${message.author.id}`)
                        .setPlaceholder('Choose one')
                        .addOptions([
                            {
                                label: 'User Settings',
                                description: 'Settings and data related to your user.',
                                value: 'user',
                                emoji: '👥'
                            },
                            {
                                label: 'Server Settings',
                                description: 'Settings and data related to your server.',
                                value: 'guild',
                                emoji: '💬'
                            },
                        ]),
                )
        ],
        ephemeral: true
    });
    // message.reply({
    //     content: '**WARNING!:**\n'
    //         + 'This will delete all settings and data for your server!',
    //     components: [
    //         new MessageActionRow()
    //             .addComponents(
    //                 new MessageButton()
    //                     .setCustomId(`wipe.guild.${message.author.id}.no`)
    //                     .setLabel('No don\'t wipe my server settings.')
    //                     .setStyle('SUCCESS'),
    //                 new MessageButton()
    //                     .setCustomId(`wipe.guild.${message.author.id}.yes`)
    //                     .setLabel('Yes wipe my server settings.')
    //                     .setStyle('DANGER')
    //             )
    //     ],
    //     ephemeral: true
    // });
};

module.exports.slash = {
    supported: true,
    // This function is simple enough that both slash and 
    // normal commands support it.
    run: module.exports.run
};