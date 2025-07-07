const fs = require('fs');
const path = require('path');
const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const {tipAdderIds} = require('../../config.json');
const {bot} = require('../../util/constants');
const {v7} = require('uuid');
const embedtip = require('../../util/functions/embedtip');
const logtip = require('../../util/functions/logtip');

module.exports = {
	cooldown: 3,
    cooldownType: 'user',
	data: new SlashCommandBuilder()
		.setName('manualtip')
        .setDescription('Manually sends a tip to the tip channel if one is set.')
        .addStringOption(option =>
            option.setName('tip')
            .setDescription('The tip to display.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('tiptitle')
            .setDescription('The title of the tip to display.')
            .setRequired(false)
        ),
	async execute(interaction) {
        if (!tipAdderIds.includes(interaction.user.id)) {
            interaction.reply({content: 'You do not have permission to use this command!', ephemeral: true});

            return;
        }

        const tip = interaction.options.getString('tip');
        const tipTitle = interaction.options.getString('tiptitle') ?? "Tip";

        const uuid = v7();
        const tipInfo = {
            "author":  `<@!${interaction.user.id}>`,
            "authorId": interaction.user.id,
            "title": tipTitle,
            "text": tip,
            "uuid": uuid,
            "timestamp": Math.floor(Date.now() / 1000)
        }

        const {tipChannelId} = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json')));
        const tipChannel = bot.channels.cache.get(tipChannelId);

        if (tipChannelId == "") {
            interaction.reply({content: "Your tip could not be displayed because a channel to send the tip in was not set!", ephemeral: true});

            return;
        }

        if (!(tipChannel.permissionsFor(bot.user).has(PermissionsBitField.Flags.SendMessages))) {
            interaction.reply({content: `The bot doesn\'t have permission to send messages in <#${tipChannel}>!`, ephemeral: true});

            return;
        }

        interaction.reply({content: `Sending your tip "${tip}" to <#${tipChannelId}>!`, ephemeral: true});

        tipChannel.send({embeds: [embedtip(tipTitle, tip)]});

        logtip(tipInfo, interaction.user.displayAvatarURL(), "manual");

        return;
}
}