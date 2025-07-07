const {Events, Collection} = require('discord.js');
const {bot, cooldowns} = require('../../util/constants');
const fs = require('fs');
const path = require('path');

const prefix = ';'

let commands = {}

const commandsDir = path.join(__dirname, '..', '..', 'commands', 'text');

fs.readdirSync(commandsDir).forEach(file => {
	if (file.endsWith('.js')) {
        const data = require(path.join(commandsDir, file))

	    commands[file.substring(0, file.length - 3)] = data;
        
        if ('aliases' in data) {
            data.aliases.forEach(alias => {
                commands[alias] = data;
            })
        }

		console.log('-> Loaded text command ' + file);
	}
});

bot.on(Events.MessageCreate, (message) => {
    if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;
    
    let command = message.content.split(" ")[0];
	command = command.slice(prefix.length);
	
	const args = message.content.slice(prefix.length).trim().split(/ +/g);

    if (command in commands) {
        const trueName = commands[command].name

        if (!cooldowns.has(trueName)) {
            cooldowns.set(trueName, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(trueName);
        const defaultCooldown = 3;
        const cooldown = (commands[command].cooldown ?? defaultCooldown) * 1000;
    
        const id = (commands[command].cooldownType === 'global') ? message.guildId : message.author.id
        
        if (timestamps.has(id)) {
            const expirationTime = timestamps.get(id) + cooldown;
            
            if (now < expirationTime) {
                // const expiredTimestamp = Math.round(expirationTime / 1000);
                
                return message.react('⌚');
                // return message.reply({content: `The command is on a cooldown! You can use it <t:${expiredTimestamp}:R>.`});
            }

            // console.log(now);
            // console.log(expirationTime);
        }

        timestamps.set(id, now);

        return commands[command].command(message, args);
    }
})