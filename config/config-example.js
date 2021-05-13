module.exports = {
    // The owners id. By default the owner has all the permissions.
    ownerID: '1234567890',
    // The Co-Owner's ids. By default the co-owners also have all the permissions.
    coOwnersIDs: [],

    // The token for bot login
    token: process.env.token,

    // This is the client secret from the developer page. Required for dashboard login.
    secret: process.env.secret,

    // This is the URL to redirect to for the discord oauth2.
    redirectURL: 'https://cool.site/callback',

    // This is the URL to redirect to for the discord oauth2.
    inviteRedirectURL: 'http://cool.site/invitecallback',

    // The url to return to after logging in. The code will be appended to this.
    dashboardReturn: 'https://dashboard.cool.site/#/callback/'
};