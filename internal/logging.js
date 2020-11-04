const { red, green, magenta, magentaBright, blueBright } = require('chalk');
const raw = {
    log: console.log,
    error: console.error,
    info: console.info,
    debug: console.debug
};

const types = {
    default: green,
    error: red,
    info: blueBright,
    debug: magentaBright
};

const makeTimestamp = () => {
    const date = new Date();
    const hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    const am = date.getHours() > 12 ? 'pm' : 'am';
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDay() + 1;
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `[${year}/${month}/${day} ${('0' + hour).slice(-2)}:${('0' + minute).slice(-2)}:${('0' + second).slice(-2)}${am}]`;
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

module.exports = (debug = process.env.NODE_ENV === 'DEVELOPMENT') => {
    console.log = (...args) => log(args);
    console.error = (...args) => log(args, 'error');
    console.info = (...args) => log(args, 'info');
    console.debug = (...args) => {
        if (debug)
            log(args, 'debug');
    };
};