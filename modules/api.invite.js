module.exports = {
    name: 'api.invite',
    trigger: 'api.invite',
    type: 'get'
};

module.exports.run = (client, ctx) => {
    let guild = ctx.query.guild;
    ctx.redirect(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot+applications.commands&permissions=137751622&response_type=code&redirect_uri=${encodeURIComponent(client.config.inviteRedirectURL)}${guild ? `&guild_id=${guild}&disable_guild_select=true` : ''}`);
    return 'Redirecting to invite page';
};