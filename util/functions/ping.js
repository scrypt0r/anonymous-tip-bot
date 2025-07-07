const {EmbedBuilder} = require('discord.js');
const {startTimestamp} = require('../../util/constants');
const formatdeltatime = require('./formatdeltatime');

module.exports = function(createdTimestamp) {
    const embed = new EmbedBuilder({
        color: 0xff7f7f,
		title: 'Pong!',
		//url: '',
		//author: {
		//	name: '',
		//	icon_url: '',
		//	url: '',
		//},
		//description: '',
		//thumbnail: {
		//	url: '',
		//},
		fields: [
			{
				name: 'Time',
				value: Date.now() - createdTimestamp + ' ms',
				inline: false
			},
            {
				name: 'Uptime',
				value: formatdeltatime(Date.now() - startTimestamp),
				inline: false
			}
		],
		//image: {
		//	url: '',
		//},
		timestamp: Date.now()
    })

    return embed;
}