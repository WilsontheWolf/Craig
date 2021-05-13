module.exports = {
    name: 'api.callback',
    trigger: 'api.callback',
    type: 'get'
};

const fetch = require('node-fetch');
const genCode = async (length = 20, validate) => {
    let valid = false;
    let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let result = '';
    while (!valid) {
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        if (!validate || typeof validate !== 'function')
            valid = true;
        else if (await validate(result)) valid = true;

    }
    return result;
};

// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, ctx) => {
    let code = ctx.query.code;
    if (!code) {
        ctx.status = 400;
        return { message: 'No code provided' };
    }

    if (!client.config.secret) {
        // We are unable to get data.
        console.error('Someone tried logging in but I don\'t have a secret!');
        ctx.status = 500;
        return { message: 'internal server error' };
    }

    const params = new URLSearchParams();
    params.append('client_id', client.user.id);
    params.append('client_secret', client.config.secret);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', client.config.redirectURL);
    params.append('scope', 'identify guilds');
    let token, data, timestamp = Date.now();
    {
        const request = await fetch('https://discord.com/api/oauth2/token', {
            method: 'post',
            body: params,
        });
        if (!request.ok) {
            console.error(`Error fetching token data! ${request.status}\n${await request.text()}`);
            ctx.status = 500;
            return { message: 'internal server error' };
        }
        token = await request.json();
    }
    if (!token.scope.split(' ').includes('identify')) {
        ctx.status = 422;
        return { message: 'Missing required scope "identify".' };
    }
    {
        const request = await fetch('https://discord.com/api/oauth2/@me', {
            headers: { authorization: `Bearer ${token.access_token}` }
        });
        if (!request.ok) {
            console.error(`Error fetching oauth2 data! ${request.status}\n${await request.text()}`);
            ctx.status = 500;
            return { message: 'internal server error' };
        }
        data = await request.json();
    }
    const stored = {
        id: data.user.id,
        accessToken: token.access_token,
        expires: timestamp + (token.expires_in * 1000),
        refreshToken: token.refresh_token,
        scopes: data.scopes
    };
    const clientCode = await genCode(20, async (value) => !(await client.db.logins.has(value)));
    await client.db.logins.set(clientCode, stored);
    ctx.redirect(`${client.config.dashboardReturn}${clientCode}`);
    return 'Redirecting to login page';
};