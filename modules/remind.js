module.exports = {
    name: 'remind',
    trigger: 'timer.event.remind',
    type: 'get'
};

// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, data, key) => {
    await client.readyPromise;
    let channel = client.channels.cache.get(data.channel);
    try {
        //TODO: Don't use split
        await channel.send({ content: `Hey <@${data.user}> you asked me to remind you:\n${data.msg}`,  split: true, allowedMentions: { users: [data.user] } });
    } catch(e) {
        console.debug(`Error reminding ${data.user} in channel. Trying dm. ${key}`);
        console.debug(e);
        try {
            const user = await client.users.fetch(data.user);
            if (!user) return console.debug(`Error getting user ${data.user} to dm. ${key}`);
            await user.send({ content: `Hey <@${data.user}> you asked me to remind you:\n${data.msg}.`,  allowedMentions: { users: [data.user] } });
        } catch (e) {
            console.debug(`Error reminding ${data.user} in dm. ${key}`);
            console.debug(e);
        }
    }
};