// Require all the things
const { Intents } = require('discord.js');
const Client = require('./internal/CraigClient');
require('dotenv').config();

// Make a client
const client = new Client({
    // I should actually use only the intents I need but I'm lazy
    ws: { intents: Intents.NON_PRIVILEGED }, 
    messageCacheLifetime: 3600, // one hour
    messageSweepInterval: 900, // 15 minutes
    messageEditHistoryMaxSize: 2
});

// Load modules
client.config = require('./config');
require('./internal/loading')(client);
require('./internal/logging')();

// Start up the bot
(async () => {
    await client.initialize();
    await client.login(client.config.token);
})();