module.exports = {
    name: 'webServer',
    trigger: 'load'
};
const Koa = require('koa');
let app;

module.exports.run = (client) => {
    if (!app) {
        app = new Koa();

        app.use(async (ctx) => {
            let { path, url } = ctx;
            let resp;
            // The client isn't ready
            if (!client.readyTimestamp) {
                ctx.status = 503;
                return ctx.body = { message: 'Client not ready' };
            }
            try {
                let get = path.replace(/^\/+|(\/)\/+|\/+$/g, '$1');
                if (!get) resp = { message: 'Api is a-ok' };
                else resp = await client.get(`api.${get}`, ctx);
                if (!resp) {
                    resp = { message: 'not found' };
                    ctx.status = 404;
                }
            } catch (e) {
                console.error(`Error serving ${url}`);
                console.error(e);
                ctx.status = 500;
                resp = { message: 'internal server error' };
            }
            ctx.body = resp;
        });

        app.listen(3000);
    }
};