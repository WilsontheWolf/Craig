module.exports = {
    name: 'privacy',
    usage: '',
    guildOnly: false,
    enabled: true,
    level: 0,
    aliases: [],
    category: 'Info',
    description: 'Show the privacy policy.',
    moreHelp: null
};
const Discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    await message.channel.send({
        embeds: [
            new Discord.MessageEmbed()
                .setTitle('Privacy Policy')
                .setDescription(`${client.user.tag} collects server, channel, and role id's. Id's are publicly available and unique to that item.
We use server id's to know where your server settings go.
We use role and channel id's to store different settings, such as modRole, adminRole and logChannel.
This data is not shared with any external companies. 
For any concerns please join the support server at https://discord.gg/${await client.db.internal.get('supportInvite')}. 
Users can have the data removed by using the command \`${message.settings.prefix}wipe\` or asking in the support server.`)
                .setColor('BLURPLE')
                .setTimestamp()
                .setFooter('Data relevant as of ')]
    });
};