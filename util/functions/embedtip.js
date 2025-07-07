const {EmbedBuilder} = require('discord.js');

module.exports = function(tipTitle, tipText) {
	let embed = new EmbedBuilder()
		.setTitle(tipTitle)
		.setDescription(tipText)
		.setColor(0xff7f7f)
		.setTimestamp();

    return embed;
}