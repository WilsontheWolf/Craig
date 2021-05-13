module.exports = {
    name: 'api.login',
    trigger: 'api.login',
    type: 'get'
};

// eslint-disable-next-line no-unused-vars
module.exports.run = (client, ctx) => {
    ctx.redirect(`https://discord.com/api/oauth2/authorize?response_type=code&client_id=${client.user.id}&redirect_uri=${encodeURIComponent(client.config.redirectURL)}&scope=identify%20guilds&prompt=none`);
    return 'Redirecting to login page';
};