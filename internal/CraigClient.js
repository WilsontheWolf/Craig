const { Client } = require('discord.js');

module.exports = class CraigClient extends Client {
    emit (event, ...args) {
        if(event !== '*') super.emit('*', event, ...args);
        return super.emit(event, ...args);
    }
};