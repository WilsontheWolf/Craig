module.exports = {
    name: 'webServer',
    type: 'load'
};
const Koa = require('koa');
const cors = require('@koa/cors');
let app, server;

module.exports.run = (client) => {
    if (!app) {
        app = new Koa({origin: '*'});
        app.use(cors());
        app.use(async (ctx) => {
            let { path, url } = ctx;
            let resp;
            // The client isn't ready
            if (!client.readyTimestamp) {
                ctx.status = 503;
                return ctx.body = { message: 'Client not ready. Please retry shortly.' };
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
        server = app.listen(process.env.PORT || 3000);
        console.log(`Running webserver on port ${process.env.PORT || 3000}`);
    }
};

module.exports.close = () => {
    if (typeof server?.close === 'function') server.close();
    console.log('Webserver closed.');
};
