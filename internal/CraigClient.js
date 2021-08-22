const { Client } = require('discord.js');

module.exports = class CraigClient extends Client {
    constructor(...args) {
        super(...args);
        this.readyPromise = new Promise((resolve) =>{
            this.once('ready', resolve);
        });
        // TODO: stop putting stuff in client and 
        // put it here or get types
        this.stuff = {};
    }
    emit (event, ...args) {
        if(event !== '*') super.emit('*', event, ...args);
        return super.emit(event, ...args);
    }
};