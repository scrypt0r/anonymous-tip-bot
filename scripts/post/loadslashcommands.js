const {Collection, Events, REST, Routes} = require('discord.js');
const {bot, TOKEN, appId, cooldowns} = require('../../util/constants');
const fs = require('fs');
const path = require('path');

let commands = [];
bot.commands = new Collection();

const commandsDir = path.join(__dirname, '..', '..', 'commands', 'slash');

bot.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const defaultCooldown = 3;
	const cooldown = (command.cooldown ?? defaultCooldown) * 1000;

	const id = (command.cooldownType === 'global') ? interaction.guildId : interaction.user.id

	if (timestamps.has(id)) {
		const expirationTime = timestamps.get(id) + cooldown;

		if (now < expirationTime) {
			const expiredTimestamp = Math.round(expirationTime / 1000);
			
			return interaction.reply({content: `The command is on a cooldown! You can use it <t:${expiredTimestamp}:R>.`, ephemeral: true});
		}
	}

	timestamps.set(id, now);

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);

		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

fs.readdirSync(commandsDir).forEach(file => {
	if (file.endsWith('.js')) {
        const command = require(path.join(commandsDir, file))
        
        if ('data' in command && 'execute' in command) {
			bot.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());

            console.log('-> Loaded slash command ' + file);
		}
	}
});

const rest = new REST().setToken(TOKEN);

(async() => {
    try {
        const data = await rest.put(
            Routes.applicationCommands(appId),
            {body: commands},
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error)
    }
})();