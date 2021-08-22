// const { Structures, MessageEmbed } = require('discord.js');
// const { LiteEmbed } = require('./util');

// const data = (channel) => {
//     const data = {};
//     const owner = channel.client.user.id === channel.guild?.ownerID;
//     const perms = channel.permissionsFor(channel.client.user.id);
//     data.send = owner || channel.viewable && perms.has('SEND_MESSAGES');
//     data.view = channel.viewable;
//     data.embed = owner || data.send && perms.has('EMBED_LINKS');
//     data.hyperlink = false;
//     return data;
// };

// Structures.extend('TextBasedChannel', TextChannel => {
//     class TextChannelPlus extends TextChannel {
//         constructor(...args) {
//             super(...args);
//             this.data = data(this);
//         }
//         send(content, options = {}) {
//             let res = { ...options };
//             if (content instanceof MessageEmbed) res.embeds = [content];
//             if (content instanceof LiteEmbed) {
//                 if (this.data.embed) res.embeds = [content.toEmbed()];
//                 else res.content = content.toString();
//             }
//             if (typeof content === 'string') options.content = content;
//             if (typeof content === 'object') res = { ...res, ...content };
//             return super.send(res);
//         }
//     }

//     return TextChannelPlus;
// });