const {SlashCommandBuilder} = require('discord.js');
const {tipAdderIds} = require('../../config.json');
const ping = require('../../util/functions/ping');

module.exports = {
	cooldown: 3,
    cooldownType: 'user',
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		if (!tipAdderIds.includes(interaction.user.id)) {
			interaction.reply({content: 'You do not have permission to use this command!', ephemeral: true});

			return;
		}

		await interaction.reply({embeds: [ping(interaction.createdTimestamp)]});
	},
};