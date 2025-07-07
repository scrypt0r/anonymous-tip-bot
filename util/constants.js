const {Client, GatewayIntentBits, Collection} = require('discord.js');
const config = require("../config.json");

const appTitle = "AnonymousTip Bot"
const version = "v1.0.0"

const startTimestamp = Date.now();
const appId = config.appId;
const TOKEN = config.token;

const bot = new Client({intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
]});

const cooldowns = new Collection();

module.exports = {
    appTitle,
    version,
    startTimestamp,
    appId,
    TOKEN,
    bot,
    cooldowns
}