const fs = require('fs');
const path = require('path');
const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');
const {tipAdderIds} = require('../../config.json');
const {bot} = require('../../util/constants');
const {v4} = require('uuid');
const tipscheduler = require('../../scripts/post/tipscheduler');
const logtip = require('../../util/functions/logtip');
const embedtip = require('../../util/functions/embedtip');

module.exports = {
	cooldown: 3,
    cooldownType: 'user',
	data: new SlashCommandBuilder()
		.setName('tip')
        .setDescription('Adds the tip to a pool of tips if a channel and interval is set. Works like /manualtip otherwise.')
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

        const uuid = v4();
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

        if (tipChannelId == "" || tipChannel === null) {
            interaction.reply({content: "Your tip could not be displayed because a channel to send the tip in was not set!", ephemeral: true});

            return;
        }

        if (!(tipChannel.permissionsFor(bot.user).has(PermissionsBitField.Flags.SendMessages))) {
            interaction.reply({content: `The bot doesn\'t have permission to send messages in <#${tipChannel.id}>!`, ephemeral: true});

            return;
        }

        if (!tipscheduler.isScheduling()) {
            interaction.reply({content: `Sending your tip "${tip}" to <#${tipChannel.id}>!`, ephemeral: true});

            tipChannel.send({embeds: [embedtip(tipTitle, tip)]});

            logtip(tipInfo, interaction.user.displayAvatarURL(), "manual");

            return;
        }

        let tips = JSON.parse(fs.readFileSync(path.join(__dirname, '../../tips.json')));

        tips[uuid] = tipInfo

        fs.writeFileSync(path.join(__dirname, '../../tips.json'), JSON.stringify(tips, null, "\t"));

        logtip(tipInfo, interaction.user.displayAvatarURL());

        interaction.reply({content: `Your tip "${tip}" has been added to the tip pool!`, ephemeral: true});
    }
}