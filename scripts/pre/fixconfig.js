const fs = require('fs');
const path = require('path');
const {bot} = require('../../util/constants');

const defaults = {
    appId: "",
	token: "",
	tipAdderIds: [""],
	tipModeratorIds: [""],
	tipChannelId: "",
	tipLogChannelId: " ",
	tipInterval: -1
}

let config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json')));

for (const [key, value] of Object.entries(defaults)) {
	if (!(key in config)) {
		config[key] = value;
	}
}

for (const key of Object.keys(config)) {
	if (!(key in defaults)) {
		config[key] = undefined;
	}
}

for (const moderatorId of config.tipModeratorIds) {
	if (!(config.tipAdderIds.includes(moderatorId))) {
		config.tipAdderIds.push(moderatorId);
	}
}

fs.writeFileSync(path.join(__dirname, '../../config.json'), JSON.stringify(config, null, "\t"));

// console.log("written");