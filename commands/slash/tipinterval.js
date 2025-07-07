const fs = require('fs');
const path = require('path');
const {SlashCommandBuilder} = require('discord.js');
const {tipModeratorIds} = require('../../config.json');
const tipScheduler = require("../../scripts/post/tipscheduler")

module.exports = {
	cooldown: 3,
    cooldownType: 'user',
	data: new SlashCommandBuilder()
		.setName('tipinterval')
		.setDescription('Sets the waiting interval between sending a new tip. Must also use /tipchannel.')
        .addNumberOption(option =>
            option.setName('timelength')
            .setDescription('The length of time (default in minutes) that will pass before another tip is sent. -1 to disable.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('unit')
            .setDescription('The unit of time. A unit with a timelength that is able to convert will still work (e.g. 61 minutes)')
            .setRequired(false)
            .addChoices(
				{name: 'second(s)', value: 'second(s)'},
				{name: 'minute(s)', value: 'minute(s)'},
				{name: 'hour(s)', value: 'hour(s)'},
			)
        ),
	async execute(interaction) {
        if (!tipModeratorIds.includes(interaction.user.id)) {
            interaction.reply({content: 'You do not have permission to use this command!', ephemeral: true});

            return;
        }

        let config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json')));

        const timeLength = interaction.options.getNumber("timelength");

        if (timeLength == -1) {
            config["tipInterval"] = -1;

            fs.writeFileSync(path.join(__dirname, '../../config.json'), JSON.stringify(config, null, "\t"));

            interaction.reply({content: 'Interval-based tip reading has been disabled!', ephemeral: true});

            return;
        }

        let unit = interaction.options.getString("unit")
        const multiplier = 
            (unit == "second(s)") ? 1 :
            (unit == "minute(s)") ? 60 :
            (unit == "hour(s)") ? 3600 :
            60;

        let waitingTime = timeLength * multiplier;
        const forcedTime = (waitingTime < 7.5);
        if (forcedTime) {
            unit = "second(s)"
            waitingTime = 7.5;
        }

        config["tipInterval"] = waitingTime;

        fs.writeFileSync(path.join(__dirname, '../../config.json'), JSON.stringify(config, null, "\t"));

        interaction.reply({content: `Tips will now output every ${waitingTime} ${unit}!` + (forcedTime ? ' (WARNING: The original time provided was less than this. 7.5 seconds is the minimum for any interval message to prevent exceeding rate limits.)' : ''), ephemeral: true});

        tipScheduler.reset()
    }
}