const fs = require('fs');
const path = require('path');
const {tipModeratorIds} = require('../../config.json');
const {PermissionsBitField} = require('discord.js');
const {bot} = require('../../util/constants');

module.exports = {
    name: 'tiplogchannel',
    aliases: ['tlc'],
    cooldown: 5,
    cooldownType: 'user',
    async command(message, args) {
        if (!tipModeratorIds.includes(message.author.id)) {
            // interaction.reply({content: 'You do not have permission to use this command!', ephemeral: true});

            return;
        }

        let tipLogChannelId = args[1]
        const tipLogChannel = bot.channels.cache.get(tipLogChannelId);

        if (tipLogChannel === undefined) {
            await message.react('❌').catch(console.error)

            return;
        }

        if (!(tipLogChannel.permissionsFor(bot.user).has(PermissionsBitField.Flags.SendMessages))) {
            await message.react('❌').catch(console.error)

            return;
        }

        let config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json')));
        
        config["tipLogChannelId"] = tipLogChannel.id;
        
        fs.writeFileSync(path.join(__dirname, '../../config.json'), JSON.stringify(config, null, "\t"));

        await message.react('✅').catch(console.error)
    }
}