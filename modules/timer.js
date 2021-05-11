const running = new Map();
let interval;

const endTimeout = async (key, client) => {
    const value = running.get(key);
    if (!value) return;
    // The event doesn't exist. Remove it from the cache but not from the database so it can be triggered later.
    if (!client.modules.find(m => m && m.trigger === `timer.event.${value.type}` && m.type === 'get')) return running.delete(key);
    client.get(`timer.event.${value.type}`, value, key);
    clearTimeout(value.timeout);
    running.delete(key);
    await client.db.timers.delete(key);
};

const processTimer = async (key, value, client) => {
    if (running.has(key)) return;
    if (value.end - Date.now() > 43200000) return;
    if (!client.modules.find(m => m && m.trigger === `timer.event.${value.type}` && m.type === 'get')) return;
    running.set(key, {
        ...value,
        timeout: setTimeout(endTimeout, value.end - Date.now(), key, client)
    });
};

module.exports = [
    {
        name: 'timer.create',
        trigger: 'timer.create',
        type: 'get',
        run: async (client, duration, data) => {
            if(!data.type) throw new Error('Please specify a type.');
            const db = client.db?.timers;
            if (!db) throw new Error('Database is missing.');
            const key = await db.autoId();
            data.end = Date.now() + duration;
            db.set(key, data);
            processTimer(key, data, client);
            return key;
        }
    },
    {
        name: 'timer.get',
        trigger: 'timer.get',
        type: 'get',
        run: (client, key) => {
            const db = client.db?.timers;
            if(!db) throw new Error('Database is missing.');
            return db.get(key.toString());
        }
    },
    {
        name: 'timer.load',
        type: 'load',
        run: async (client) => {
            const db = client.db?.timers;
            if (!db) throw new Error('Database is missing.');
            const entries = await db.filter(entry => entry.end - Date.now() < 43200000);
            Object.entries(entries).forEach(([key, value]) => {
                processTimer(key, value, client);
            });
            interval = setInterval(async () => {
                const entries = await db.filter(entry => entry.end - Date.now() < 43200000);
                Object.entries(entries).forEach(([key, value]) => {
                    processTimer(key, value, client);
                });
            }, 21600000);
        },
        close: () => {
            running.forEach((e, key) => {
                clearTimeout(e.timeout);
                running.delete(key);
            });
            clearInterval(interval);
            interval = null;
        }
    },
    {
        name: 'timer.newEvent',
        trigger: 'loader.load',
        type: 'run',
        run: async (client, name) => {
            if(!name.startsWith('timer.event.')) return;
            const type = name.slice('timer.event.'.length);
            const db = client.db?.timers;
            if(!db) return;
            const entries = await db.filter(entry => entry.type === type && entry.end - Date.now() < 43200000);
            Object.entries(entries).forEach(([key, value]) => {
                processTimer(key, value, client);
            });
        }
    },
];