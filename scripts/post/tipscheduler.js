const fs = require('fs');
const path = require('path');
const {bot} = require('../../util/constants');
const embedtip = require("../../util/functions/embedtip");

let scheduling = false;
let timeoutID;

function nextTip() {
    scheduling = false;

    const {tipInterval, tipChannelId} = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json')));
    const tips = JSON.parse(fs.readFileSync(path.join(__dirname, '../../tips.json')));

    if (timeoutID !== null) {
        clearTimeout(timeoutID);
    }

    const tipChannel = bot.channels.cache.get(tipChannelId);

    if (tipChannel !== null & tipInterval != -1) {
        scheduling = true;

        timeoutID = setTimeout(function() {
            let keys = Object.keys(tips);
            let chosenTip = tips[keys[keys.length * Math.random() << 0]];

            if (chosenTip) {
                // console.log(tipInterval)

                tipChannel.send({embeds: [embedtip(chosenTip["title"], chosenTip["text"])]});
            }

            nextTip();
        }, tipInterval * 1000)
    }
}

module.exports = {
    reset: function() {
        nextTip();
    },
    isScheduling: function() {
        return scheduling;
    }
}

nextTip();