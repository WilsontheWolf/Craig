module.exports = {
    name: 'eval',
    usage: '[code]',
    guildOnly: false,
    enabled: true,
    level: 9,
    aliases: [],
    category: 'System',
    description: 'Run JS code.',
    moreHelp: null
};
const Discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    let silent = false;
    if (message.options.includes('s')) {
        silent = true;
    }
    if (message.options.includes('d')) {
        message.delete().catch(() => { });
    }
    const embed = new Discord.MessageEmbed()
        .setFooter(`Eval command executed by ${message.author.username}`)
        .setTimestamp();
    let code = args.join(' ');
    let msg;
    let response;
    let e = false;
    try {
        if (code.includes('await') && !message.content.includes('\n'))
            code = '( async () => {return ' + code + '})()';
        else if (code.includes('await') && message.content.includes('\n'))
            code = '( async () => {' + code + '})()';
        response = await eval(code);
        if (typeof response !== 'string') {
            response = require('util').inspect(response, { depth: 3 });
        }
    } catch (err) {
        e = true;
        response = err.toString();
        const Linter = require('eslint').Linter;
        let linter = new Linter();
        let lint = linter.verify(code, { 'env': { 'commonjs': true, 'es2021': true, 'node': true }, 'extends': 'eslint:recommended', 'parserOptions': { 'ecmaVersion': 12 } });
        let error = lint.find(e => e.fatal);
        if (error) {
            let line = code.split('\n')[error.line - 1];
            let match = line.slice(error.column - 1).match(/\w+/i);
            let length = match ? match[0].length : 1;
            response = `${line}
${' '.repeat(error.column - 1)}${'^'.repeat(length)}
[${error.line}:${error.column}] ${error.message} `;
        }

    }
    if (silent) return;
    const length = `\`\`\`${response}\`\`\``.length;
    embed
        .setTitle(e ? '**Error**' : '**Success**')
        .setColor(e ? 'RED' : 'GREEN')
        .setDescription(`\`\`\`${response.substr(0, 2042)}\`\`\``);
    if (length >= 2049) {
        console.log(`An eval command executed by ${message.author.username}'s response was too long (${length}/2048) the response was:
${response}`);
        embed.addField('Note:', `The response was too long with a length of \`${length}/2048\` characters. it was logged to the console`);
    }
    // eslint-disable-next-line no-unused-vars
    msg = await message.channel.send(embed);
    // msg.react('💥')
};