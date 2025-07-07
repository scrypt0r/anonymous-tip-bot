const fs = require('fs');
const path = require('path');
const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const {tipAdderIds} = require('../../config.json');
const logtip = require('../../util/functions/logtip');

module.exports = {
	cooldown: 3,
    cooldownType: 'user',
	data: new SlashCommandBuilder()
		.setName('removetipbyuuid')
        .setDescription('Deletes a tip from the tip pool via tip UUID.')
        .addStringOption(option =>
            option.setName('tipuuid')
            .setDescription('The UUID of the tip that will be removed.')
            .setRequired(true)
        ),
	async execute(interaction) {
        if (!tipAdderIds.includes(interaction.user.id)) {
            interaction.reply({content: 'You do not have permission to use this command!', ephemeral: true});

            return;
        }

        let tips = JSON.parse(fs.readFileSync(path.join(__dirname, '../../tips.json')));

        let uuid = interaction.options.getString('tipuuid');

        const matches = Object.keys(tips).filter(key => key.includes(uuid));

        uuid = (matches.length === 1) ? matches[0] : undefined;

        if (!(uuid in tips)) {
            interaction.reply({content: 'A tip with that UUID does not exist!', ephemeral: true});

            return;
        }

        tipInfo = tips[uuid];
        tips[uuid] = undefined;

        fs.writeFileSync(path.join(__dirname, '../../tips.json'), JSON.stringify(tips, null, "\t"));

        tipInfo["deleter"] = `<@!${interaction.user.id}>`

        logtip(tipInfo, interaction.user.displayAvatarURL(), "removing");

        interaction.reply({content: `Your tip "${tipInfo["text"]}" has been removed from the tip pool!`, ephemeral: true});
    }
}