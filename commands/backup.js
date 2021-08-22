module.exports = {
    name: 'backup',
    usage: '[db\'s]',
    guildOnly: false,
    enabled: true,
    level: 9,
    aliases: [],
    category: 'System',
    description: '[internal] Backup the databases.',
    moreHelp: null
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    // Check if the user specifies valid backups
    let dbs = ['settings', 'internal'];
    if(args[0])dbs = args.filter(a => dbs.find(d => d == a));
    if (!dbs[0]) return message.reply('Please choose at least one valid db.');
    const fs = require('fs').promises;
    await fs.mkdir('./backups').catch(() => '/dev/null');
    let suc = [];
    let err = [];
    for (let i = 0; i < dbs.length; i++) {
        let db = dbs[i];
        try {
            await fs.writeFile(`./backups/${db}.json`, await client[db].export());
            suc.push(db);
        } catch (e) {
            err.push(db);
            console.error(`Error saving: ${db}`);
            console.error(e);
        }
    }
    let m = `Successfully saved ${suc.length == 1 ? suc[0] : `all ${suc.length} db's`}`;
    if(err.length && !suc.length) m = `${err.length == 1 ? `All ${err.length}` : 'Your'} db${err.length == 1 ? 's' : ''} failed to save.`;
    if(err.length && suc.length) m = `${err.length} db${err.length == 1 ? 's' : ''} failed to save. They were ${'```'}\n${err.join('\n')}${'```'}`;
    await message.reply(m);
};