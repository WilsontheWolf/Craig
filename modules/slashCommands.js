// WARNING: This is in early testing. This does not represent the final state of this code
module.exports = {
    name: 'slashCommand',
    trigger: 'event.raw'
};
const fetch = require('node-fetch');
const Discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, packet) => {
    if (!packet || packet.t !== 'INTERACTION_CREATE') return;
    if (!client.slash) client.slash = [];
    client.slash.push(packet);
    let { data, member: memberRaw, guild_id: guildID } = packet.d;
    if (!data || !memberRaw || !memberRaw.user) return console.debug('Slash command missing stuff!');
    let guild = client.guilds.cache.get(guildID);
    let member;
    if (guild) member = new Discord.GuildMember(client, memberRaw, guild);
    let user = new Discord.User(client, memberRaw.user);
    const url = `https://discord.com/api/v8/interactions/${packet.d.id}/${packet.d.token}/callback`;
    const reply = async (content, hidden = true, type = 4) => {
        let res;
        if (typeof content === 'string') res = {
            content,
            flags: hidden ? 64 : 0
        };
        else if (content instanceof Discord.MessageEmbed) res = {
            embeds: [content],
            flags: hidden ? 64 : 0
        };
        else throw new Error('Invalid data type!');
        let request = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                type,
                data: res
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!request.ok) {
            console.error('Failed to send', request.url, request.status, await request.text());
            return '';
        }
        return await request.text();


    };
    const { name, options: rawArgs } = data;
    let command = client.commands.get(name);
    if (!command) return reply(`I'm sorry that command doesn't seem to exist :V. Please report this error to https://discord.gg/${await client.db.internal.get('supportInvite')}`);
    if (!command.slash || !command.slash.supported || !command.slash.run || typeof command.slash.run !== 'function') return reply(`I'm sorry that command doesn't seem to be supported :V. Please report this error to https://discord.gg/${await client.db.internal.get('supportInvite')}`);
    let args = new Map();
    if (rawArgs) rawArgs.forEach(({ value, name }) => {
        args.set(name, value);
    });
    let resData = {
        author: user, 
        member, 
        guild, 
        client
    };
    resData.level = await client.getLevel(resData);
    resData.settings = await client.getSettings(resData);
    try {
        await command.slash.run(client, args, resData, reply);
    } catch (e) {
        console.error(`${user.tag} had an error running slash command ${name}!`);
        console.error(e);
        reply(`There was an unexpected error running that command.
If you get support on this error please provide this info: ${'```'}
${e}
${'```'}`);
    }
};
