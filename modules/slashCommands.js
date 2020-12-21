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
    console.debug('Received slash command stuff', packet.d);
    if (!client.slash) client.slash = [];
    client.slash.push(packet);
    let data = packet.d.data;
    if (!data) return console.error('WTF slash command with no data!');
    const url = `https://discord.com/api/v8/interactions/${packet.d.id}/${packet.d.token}/callback`;
    if (data.name === 'say')
        console.log(await (await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                type: 4,
                data: {
                    content: data.options.find(v => v.name === 'content').value
                }
            }),
            headers: { 'Content-Type': 'application/json' }
        })).text());
    if (data.name === 'whisper')
        console.log(await (await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                type: 3,
                data: {
                    content: data.options.find(v => v.name === 'content').value,
                    flags: 64
                }
            }),
            headers: { 'Content-Type': 'application/json' }
        })).text());
};
