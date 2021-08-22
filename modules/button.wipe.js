module.exports = {
    name: 'button.wipe',
    trigger: 'button.wipe',
    type: 'get'
};

module.exports.run = () => async (client, i, [type, author, act]) => {
    if (author !== i.user.id) return i.reply({
        content: 'You did not start this interaction. Please run this command yourself to act on it.',
        ephemeral: true
    });
    if (act === 'yes') {
        if (type === 'guild') {
            if (i.level < 3) return i.reply({
                content: 'You do not seem to have the perms to delete this server\'s settings.',
                ephemeral: true
            });
            await client.db.settings.delete(i.guild.id);
            Object.keys(await client.db.points.filter(p => p.guild === i.guild.id))
                .forEach(p => client.db.points.delete(p));
            Object.keys(await client.db.tags.filter(p => p.guild === i.guild.id))
                .forEach(p => client.db.tags.delete(p));
            i.update({
                content: 'Successfully deleted your servers settings!',
                components: []
            });
        } else if (type === 'user') {
            Object.keys(await client.db.logins.filter(p => p.id === author))
                .forEach(p => client.db.logins.delete(p));
            // Only reminders so stuff like mutes and who knows what else still exist.
            Object.keys(await client.db.timers.filter(p => p.user === author && p.type === 'remind'))
                .forEach(p => client.db.timers.delete(p));
            i.update({
                content: 'Successfully deleted your user settings!',
                components: []
            });
        } else return i.reply({
            content: 'Something went wrong.',
            ephemeral: true
        });
    }
    else
        return i.update({
            content: 'Canceled. Your setting have not been deleted.',
            components: []
        });

};