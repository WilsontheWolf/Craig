// Require all the things
const { Intents } = require('discord.js');
const Client = require('./internal/CraigClient');
require('dotenv').config();

// Make a client
const client = new Client({ ws: { intents: Intents.NON_PRIVILEGED } });

// Load modules
client.config = require('./config');
require('./internal/loading')(client);
require('./internal/logging')();
// Start up the bot
(async () => {
    await client.initialize();
    await client.login(client.config.token);
})();