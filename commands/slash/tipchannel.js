const fs = require('fs');
const path = require('path');
const {SlashCommandBuilder, ChannelType, PermissionsBitField} = require('discord.js');
const {tipModeratorIds} = require('../../config.json');
const {bot} = require('../../util/constants');
const tipScheduler = require("../../scripts/post/tipscheduler")

module.exports = {
	cooldown: 3,
    cooldownType: 'user',
	data: new SlashCommandBuilder()
		.setName('tipchannel')
        .setDescription('Sets the tip channel. Make sure the bot has permission to send messages there.')
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('The channel in question.')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        ),
	async execute(interaction) {
        if (!tipModeratorIds.includes(interaction.user.id)) {
            interaction.reply({content: 'You do not have permission to use this command!', ephemeral: true});

            return;
        }

        let tipChannel = interaction.options.getChannel('channel');

        if (!(tipChannel.permissionsFor(bot.user).has(PermissionsBitField.Flags.SendMessages))) {
            interaction.reply({content: `The bot doesn\'t have permission to send messages in <#${tipChannel.id}>!`, ephemeral: true});

            return;
        }

        let config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json')));

        config["tipChannelId"] = tipChannel.id;

        fs.writeFileSync(path.join(__dirname, '../../config.json'), JSON.stringify(config, null, "\t"));

        interaction.reply({content: `Tips will now send in <#${tipChannel.id}>!`, ephemeral: true});

        tipScheduler.reset()
    }
}