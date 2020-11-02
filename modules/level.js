module.exports = {
    name: 'level',
    trigger: 'event:message'
};

// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message) => {
};

module.exports.check = (client, message) => !message.state.ignore && !message.state.isCommand;