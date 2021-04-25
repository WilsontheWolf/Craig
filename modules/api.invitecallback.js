module.exports = {
    name: 'api.invitecallback',
    trigger: 'api.invitecallback',
    type: 'get'
};

module.exports.run = (client, ctx) => {
    ctx.redirect(`${client.config.dashboardReturn}invite`);
    return 'Redirecting to dashboard';
};