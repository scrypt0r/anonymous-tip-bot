const fs = require('fs');
const path = require('path');
const {tipModeratorIds} = require('../../config.json');

module.exports = {
    name: 'removetipadder',
    aliases: ['rta'],
    cooldown: 5,
    cooldownType: 'user',
    async command(message, args) {
        if (!tipModeratorIds.includes(message.author.id)) {
            // interaction.reply({content: 'You do not have permission to use this command!', ephemeral: true});

            return;
        }

        let userId = args[1]

        let config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json')));

        if (!(config.tipAdderIds.includes(userId)) || (config.tipModeratorIds.includes(userId))) {
            console.log("moderator status found");

            await message.react('❌').catch(console.error)

            return;
        }
        
        let index = config.tipAdderIds.indexOf(userId);
        if (index > -1) {
            config.tipAdderIds.splice(index, 1)
        }
        
        fs.writeFileSync(path.join(__dirname, '../../config.json'), JSON.stringify(config, null, "\t"));

        await message.react('✅').catch(console.error)
    }
}