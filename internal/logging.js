const chalk = require('chalk');
const { red, green, magenta, magentaBright, blueBright } = require('chalk');
const raw = {
    log: console.log,
    error: console.error,
    info: console.info,
    debug: console.debug,
    warn: console.warn
};

const types = {
    default: green,
    error: red,
    info: blueBright,
    debug: magentaBright,
    warn: chalk.keyword('orange')
};
const pad = (input) => input.toString().padStart(2, '0');

const makeTimestamp = () => {
    const date = new Date();
    const hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    const am = date.getHours() > 12 ? 'pm' : 'am';
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDay() + 1);
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());
    return `[${year}/${month}/${day} ${hour}:${minute}:${second}${am}]`;
};
const log = async (args, type) => {
    const colour = types[type] || types.default;
    const log = raw[type] || raw.log;
    const content = (await Promise.all(args.map(async a => {
        try {
            if (a instanceof Promise) a = await a;
        }
        catch (e) {
            a = e;
        }
        if (typeof a === 'string') return colour(a);
        else return require('util').inspect(a, { colors: true });
    }))).join(' ');
    log(magenta(makeTimestamp()), content);
};

module.exports = (debug = process.env.NODE_ENV.toUpperCase() === 'DEVELOPMENT') => {
    console.log = (...args) => log(args);
    console.error = (...args) => log(args, 'error');
    console.info = (...args) => log(args, 'info');
    console.warn = (...args) => log(args, 'warn');
    console.debug = (...args) => {
        if (debug)
            log(args, 'debug');
    };
};
