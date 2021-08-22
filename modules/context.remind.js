const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'context.remind',
    trigger: 'context.remind_me',
    type: 'get'
};

module.exports.run = () => async (client, i) => {
    let msg = await client.channels.cache.get(i.channelId).messages.fetch(i.targetId);
    if (!msg) return i.reply({
        content: 'I\'m sorry something went terribly wrong!',
        ephemeral: true
    });
    i.reply({
        content: `When would you like me to remind you about [this message](${msg.url} "Message by ${msg.author.tag}")?`,
        ephemeral: true,
        components: [
            new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`remind.msg.${msg.id}.${msg.channel.id}${msg.guild ? `.${msg.guild.id}` : ''}`)
                        .setPlaceholder('For how long?')
                        .addOptions([
                            {
                                label: '10 Minutes',
                                value: '600000'
                            },
                            {
                                label: '1 Hour',
                                value: '3600000'
                            },
                            {
                                label: '12 Hours',
                                value: '43200000'
                            },
                            {
                                label: '1 Day',
                                value: '86400000'
                            },
                        ]),
                )
        ]
    });
};