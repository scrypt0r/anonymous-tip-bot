const fs = require('fs');
const path = require('path');
const {tipModeratorIds} = require('../../config.json');
const {bot} = require('../../util/constants');

module.exports = {
    name: 'addtipadder',
    aliases: ['ata'],
    cooldown: 5,
    cooldownType: 'user',
    async command(message, args) {
        if (!tipModeratorIds.includes(message.author.id)) {
            // interaction.reply({content: 'You do not have permission to use this command!', ephemeral: true});

            return;
        }

        let userId = args[1]
        const user = bot.users.cache.get(userId);

        if (user === undefined) {
            await message.react('❌').catch(console.error)

            return;
        }

        let config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json')));

        if (config.tipAdderIds.includes(user.id)) {
            await message.react('❌').catch(console.error)

            return;
        }
        
        config.tipAdderIds.push(user.id);
        
        fs.writeFileSync(path.join(__dirname, '../../config.json'), JSON.stringify(config, null, "\t"));

        await message.react('✅').catch(console.error)
    }
}