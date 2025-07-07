const fs = require('fs');
const path = require('path');
const {EmbedBuilder} = require('discord.js');
const {bot} = require('../../util/constants');

module.exports = function(tipInfo, thumbnail, actionType) {
    const {tipLogChannelId} = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json')));
    const tipLogChannel = bot.channels.cache.get(tipLogChannelId);

    if (tipLogChannel === null) {
        return;
    }

    let embed = new EmbedBuilder()
        .setTitle(
            (actionType == "manual") ? "A tip was manually displayed" : 
            (actionType == "removing") ? "A tip was removed from the pool" : 
            "A new tip was added to the pool")
        .setColor(0x7fff7f)
        .setThumbnail(thumbnail)
        .setTimestamp();

    switch (actionType) {
        case "manual":
            embed.addFields({
                name: "Author",
                value: tipInfo["author"]
            }, {
                name: "Title",
                value: tipInfo["title"]
            }, {
                name: "Tip",
                value: tipInfo["text"]
            })
            
            break;
        case "removing":
            embed.addFields({
                name: "Deleter",
                value: tipInfo["deleter"],
                inline: true
            }, {
                name: "Author",
                value: tipInfo["author"],
                inline: true
            }, {
                name: "Creation Date",
                value: `<t:${tipInfo["timestamp"]}:f>`,
                inline: true
            }, {
                name: "Title",
                value: tipInfo["title"]
            }, {
                name: "Tip",
                value: tipInfo["text"]
            }, {
                name: "UUID",
                value: tipInfo["uuid"]
            })

            break;
        default:
            embed.addFields({
                name: "Author",
                value: tipInfo["author"],
            }, {
                name: "Title",
                value: tipInfo["title"]
            }, {
                name: "Tip",
                value: tipInfo["text"]
            }, {
                name: "UUID",
                value: tipInfo["uuid"]
            })
    }

    tipLogChannel.send({embeds: [embed]});
}