/* global unRequire */
const fs = require('fs').promises;
const { Collection } = require('discord.js');

module.exports = (client) => {
    global.unRequire = (file) => {
        if (!file) throw new Error('Please provide a file to un-require.');
        const mod = require.cache[require.resolve(file)];
        delete require.cache[require.resolve(file)];
        if (mod.children && mod.children.length)
            for (let i = 0; i < mod.children.length; i++) {
                if (mod.children[i] === mod) {
                    mod.children.splice(i, 1);
                    break;
                }
            }
    };

    client.loadModule = (cmd) => {
        if (!client.modules) client.modules = new Collection();
        try {
            let name = cmd.split('.');
            name.pop();
            name = name.join('.');
            console.info(`Loading module ${name}...`);
            const c = require(`../modules/${cmd}`);
            client.modules.set(c.name, c);
        } catch (e) {
            console.error(`Error loading module ${cmd}:`);
            console.error(e);
            return e;
        }
    };

    client.loadAllModules = async () => {
        let modules = (await fs.readdir('./modules')).filter(m => m.endsWith('.js'));
        console.info(`Loading ${modules.length} modules.`);
        let done = 0;
        modules.forEach(mod => {
            let r = client.loadModule(mod);
            if (!r) done++;
        });
        console.log(`Successfully loaded ${done}/${modules.length} module${modules.length !== 1 ? 's' : ''}.`);
    };

    client.unloadModule = async moduleName => {
        let module = client.modules.get(moduleName);
        if (!module)
            return `The module \`${moduleName}\` doesn't seem to exist. Try again!`;
        if (module.shutdown) {
            await module.shutdown(client);
        }
        try {
            unRequire(`../modules/${module}`);
        } catch (e) {
            return 'Error un-requiring';
        }
        return false;
    };

    client.loadOverride = (cmd) => {
        if (!client.overrides) client.overrides = new Collection();
        try {
            let name = cmd.split('.');
            name.pop();
            name = name.join('.');
            console.info(`Loading override ${name}...`);
            const c = require(`../overrides/${cmd}`);
            client.overrides.set(name, c);
        } catch (e) {
            console.error(`Error loading override ${cmd}:`);
            console.error(e);
            return e;
        }
    };

    client.loadAllOverrides = async () => {
        let overrides = (await fs.readdir('./overrides')).filter(m => m.endsWith('.js'));
        console.info(`Loading ${overrides.length} override${overrides.length !== 1 ? 's' : ''}.`);
        let done = 0;
        overrides.forEach(mod => {
            let r = client.loadOverride(mod);
            if (!r) done++;
        });
        console.log(`Successfully loaded ${done}/${overrides.length} override${overrides.length !== 1 ? 's' : ''}.`);
    };

    client.unloadOverride = async overrideName => {
        let override = client.overrides.get(overrideName);
        if (!override)
            return `The override \`${overrideName}\` doesn't seem to exist. Try again!`;
        if (override.shutdown) {
            await override.shutdown(client);
        }
        try {
            unRequire(`../overrides/${override}`);
        } catch (e) {
            return 'Error un-requiring';
        }
        return false;
    };

    client.on('*', (event, ...args) => {
        client.run(`event.${event}`, args);
    });

    client.run = async (trigger, payload) => {
        if(!Array.isArray(payload)) payload = [payload];
        const override = client.overrides.get(trigger);
        if (override && typeof override === 'function') payload = await override(client, ...payload);
        client.modules.filter(m => m && m.trigger === trigger).forEach(async e => {
            if (typeof e.check === 'function') 
                if(!(await e.check(client, ...payload))) return;            
            if (typeof e.run === 'function') e.run(client, ...payload);
        });
    };
    client.initialize = async () => {
        client.modules = new Collection();
        client.overrides = new Collection();
        await client.loadAllOverrides();
        await client.loadAllModules();
        client.run('load');
        return;
    };
};