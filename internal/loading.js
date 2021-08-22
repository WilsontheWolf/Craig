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
    // Internal function to run modules
    const runModule = async (m, payload = []) => {
        if (typeof m.check === 'function')
            if (!(await m.check(client, ...payload))) return;
        if (typeof m.run === 'function') m.run(client, ...payload);
    };

    client.loadModule = (cmd) => {
        if (!client.modules) client.modules = new Collection();
        try {
            let name = cmd.split('.');
            if (name.length !== 1) name.pop();
            name = name.join('.');
            console.debug(`Loading module ${name}...`);
            let module = require(`../modules/${cmd}`);
            if (!Array.isArray(module)) module = [module];
            module.forEach(m => {
                m.type = m.type ?? 'run';
                m.__fileName = `../modules/${cmd}`;
                if (m.type === 'get' && client.modules.find(({ trigger, type }) => type === 'get' && trigger === m.trigger))
                    console.error(`Loading module ${name} failed! A get module with this trigger already exists!`);
                else {
                    client.modules.set(m.name, m);
                    if (m.type === 'load') runModule(m);
                    client.run('loader.load', name);
                }
            });
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
        console.debug(`Unloading module ${moduleName}...`);
        if (module.close)
            await module.close(client);
        try {
            // Don't unRequire if other modules are using the same module.
            if (client.modules.filter((m, name) => m.__fileName || `../modules/${name}` === module.__fileName).size <= 1)
                unRequire(module.__fileName || `../modules/${moduleName}`);
            client.modules.delete(moduleName);
            client.run('loader.unload', moduleName);
        } catch (e) {
            console.error(`Error un-requiring ${moduleName}\n`, e);
            return 'Error un-requiring';
        }
        return false;
    };

    client.loadOverride = (cmd) => {
        if (!client.overrides) client.overrides = new Collection();
        try {
            let name = cmd.split('.');
            if (name.length !== 1) name.pop();
            name = name.join('.');
            console.debug(`Loading override ${name}...`);
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
        console.debug(`Unloading override ${overrideName}...`);
        if (override.close)
            await override.close(client);
        try {
            unRequire(`../overrides/${overrideName}`);
            client.overrides.delete(overrideName);
        } catch (e) {
            console.error(`Error un-requiring ${overrideName}\n`, e);
            return 'Error un-requiring';
        }
        return false;
    };

    client.on('*', (event, ...args) => {
        client.run(`event.${event}`, ...args);
    });

    client.run = async (trigger, ...payload) => {
        const override = client.overrides.get(trigger);
        if (override && typeof override === 'function') payload = await override(client, ...payload);
        client.modules.filter(m => m && m.trigger === trigger && m.type === 'run').forEach(async e => {
            runModule(e, payload);
        });
    };
    client.get = (trigger, ...payload) => {
        const module = client.modules.find(m => m && m.trigger === trigger && m.type === 'get');
        if (typeof module?.run === 'function') return module.run(client, ...payload);
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