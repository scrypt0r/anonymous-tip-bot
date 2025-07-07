const {Events, ActivityType} = require('discord.js');
const {appTitle, version, bot, TOKEN} = require('./util/constants')
const fs = require('fs');
const path = require('path');

const scriptsDir = path.join(__dirname, 'scripts');

function loadScripts(directory) {
	const newDir = path.join(scriptsDir, directory);

	fs.readdirSync(newDir).forEach(file => {
		if (file.endsWith('.js')) {
			require(path.join(newDir, file));

			console.log('-> Loaded ' + file);
		}
	});
}

console.log(`${appTitle} - ${version}`)
console.log('\n')

console.log('Loading pre-initiation scripts...');
loadScripts('pre');
console.log('\n'); // Successfully loaded pre-initiation scripts!

bot.once(Events.ClientReady, async () => {
	console.log(`-> Ready! Logged in as ${bot.user.tag}\n`);

	bot.user.setPresence({
		activities: [],
		status: 'online'
	})

	console.log('Loading post-initiation scripts...');
	loadScripts('post');
	console.log('\n'); // Successfully loaded post-initiation scripts!
});

console.log('Logging in...');
bot.login(TOKEN);