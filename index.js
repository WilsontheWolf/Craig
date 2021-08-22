// Require all the things
const { LimitedCollection, Options } = require('discord.js');
const Client = require('./internal/CraigClient');
require('dotenv').config();

// Make a client
const client = new Client({
    // I should actually use only the intents I need but I'm lazy
    intents: 32509,
    makeCache: Options.cacheWithLimits({
        ...Options.defaultMakeCacheSettings,
        MessageManager: {
            sweepInterval: 900, // 15 minutes
            sweepFilter: LimitedCollection.filterByLifetime({
                lifetime: 3600, // one hour
                getComparisonTimestamp: e => e.editedTimestamp ?? e.createdTimestamp,
            }),
            maxSize: 200
        },
        ThreadManager: {
            sweepInterval: 3600, // one hour
            sweepFilter: LimitedCollection.filterByLifetime({
                getComparisonTimestamp: e => e.archiveTimestamp,
                excludeFromSweep: e => !e.archived,
            }),
        },
    })
});

// Load modules
client.config = require('./config');
require('./internal/loading')(client);
require('./internal/logging')();

// Start up the bot
(async () => {
    try {
        await client.initialize();
        await client.login(client.config.token);
    } catch (e) {
        console.error('Fatal Error Loading Client!', e);
        client.destroy();
        process.exit(1);
    }
})();