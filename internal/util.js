const Discord = require('discord.js');

/**
 * A embed that can be represented as text.
 */
class LiteEmbed {
    /**
     * A embed that can be represented as text.
     */
    constructor() {
        this.title = null;
        this.description = null;
        this.color = null;
    }
    /**
     * Set the title of the embed.
     * @param {string} title - The title of the embed.
     */
    setTitle(title) {
        this.title = title;
        return this;
    }
    /**
     * Set the description of the embed.
     * @param {string} description - The description of the embed.
     */
    setDescription(description) {
        this.description = description;
        return this;
    }
    /**
     * Set the color of the embed.
     * @param {*} color - The color of the embed.
     */
    setColor(color) {
        this.color = color;
        return this;
    }
    /**
     * Makes the embed in a string form.
     * @returns {string} The embed as a string.
     */
    toString() {
        return `${this.title ? `**${this.title}**\n` : ''}${this.description ? `>>> ${this.description}` : ''}`;
    }
    /**
     * Makes the embed to a json.
     * @returns {object} - The JSON embed object.
     */
    toJSON() {
        return this.toEmbed()
            .toJSON();
    }
    /**
     * Returns the MessageEmbed from this embed.
     * @returns {Discord.MessageEmbed} - The embed object.
     */
    toEmbed() {
        return new Discord.MessageEmbed()
            .setTitle(this.title)
            .setDescription(this.description)
            .setColor(this.color);
    }
    /**
     * Exports the LiteEmbed as a embed or string.
     * @param {boolean} embed - Whether or not to be an embed object.
     */
    export(embed) {
        return embed ? this.toEmbed() : this.toString();
    }
}

module.exports = {
    /**
     * Get a bunch of info from a message or slash command object.
     * @param {Message|Object} message - The message or slash command object.
     * @param {'msg'|'slash'} type - The type of the provided object.
     * @returns {object} The object with the utils.
     */
    message: (message, type = 'msg') => {
        if (type === 'msg') {
            const data = {};
            const owner = message.client.user.id === message.guild?.ownerID;
            const channel = message.channel;
            const perms = channel.permissionsFor(message.client.user.id);
            data.send = owner || channel.viewable && perms.has('SEND_MESSAGES');
            data.view = channel.viewable;
            data.embed = owner || data.send && perms.has('EMBED_LINKS');
            data.hyperlink = false;
            return data;
        } else if (type === 'slash') {
            const data = {};
            const channel = message.channel;
            // Slash commands ignore channel perms for sending.
            data.send = true;
            data.embed = true;
            data.hyperlink = true;
            data.view = channel.viewable;
            return data;
        } else throw new Error(`Unsupported type ${type}`);
    },
    LiteEmbed
};