module.exports = {
    name: 'api.me',
    trigger: 'api.me',
    type: 'get'
};

const fetch = require('node-fetch');
const cache = new (require('discord.js').Collection)();
const wait = require('util').promisify(setTimeout);
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, ctx) => {
    const token = ctx.headers.authorization;
    if (!token) {
        ctx.status = 401;
        return { message: 'Unauthorized' };
    }
    const info = await client.db.logins.get(token);
    if (!info) {
        ctx.status = 403;
        return { message: 'Forbidden' };
    }
    if (Date.now() > info.expires) {
        ctx.status = 403;
        return { message: 'Forbidden' };
    }
    let user, guilds;
    let cached = cache.get(info.id);
    if (cached) {
        user = cached.user;
        guilds = cached.guilds;
    }
    else {
        {
            let retry = true;
            let request;
            while (retry) {
                request = await fetch('https://discord.com/api/users/@me', {
                    headers: { authorization: `Bearer ${info.accessToken}` }
                });
                if (request.status === 429) {
                    retry = true;
                    try {
                        await wait((await request.json()).retry_after);
                    } catch (e) { }
                } else retry = false;
            }

            if (!request.ok) {
                console.error(`Error fetching oauth2 user data! ${request.status}\n${await request.text()}`);
                ctx.status = 500;
                return { message: 'internal server error' };
            }
            user = await request.json();
        }
        if (info.scopes.includes('guilds')) {
            let retry = true;
            let request;
            while (retry) {
                request = await fetch('https://discord.com/api/users/@me/guilds', {
                    headers: { authorization: `Bearer ${info.accessToken}` }
                });
                if(request.status === 429) {
                    retry = true;
                    try {
                        await wait((await request.json()).retry_after);
                    } catch(e) {}
                } else retry = false;
            }

            if (!request.ok) {
                console.error(`Error fetching oauth2 guild data! ${request.status}\n${await request.text()}`);
                ctx.status = 500;
                return { message: 'internal server error' };
            }
            guilds = await request.json();
        }
        cache.set(info.id, {
            user,
            guilds
        });

        setTimeout(() => {
            cache.delete(info.id);
        }, 1000 * 60 * 10);
    }
    const resp = {
        user,
        guilds: guilds ? guilds.map(g => {
            g.botJoined = client.guilds.cache.has(g.id);
            // g.level = 
            g.botPerms = g.botJoined ? client.guilds.cache.get(g.id).me.permissions : null;
            return g;
        }) : null
    };
    return resp;
};
