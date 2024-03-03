import 'source-map-support/register';

import { importx } from '@discordx/importer';

import logger from './logger';
import { ILogger, Client } from 'discordx';
import dotenv from 'dotenv';
import { Interaction } from 'discord.js';
import { i18nReady } from './i18n';
dotenv.config();

const customLogger: ILogger = {
    error: logger.error,
    info: logger.info,
    log: logger.debug,
    warn: logger.warn
};

const client = new Client({
    intents: [],
    logger: customLogger
});

client.on('interactionCreate', async (interaction: Interaction) => {
    await client.executeInteraction(interaction);
});

client.on('error', (error) => {
    logger.error(error);
});

client.once('ready', async () => {
    await client.initApplicationCommands();
    logger.info('Bot is ready');
});

async function start() {
    await i18nReady; // Wait for i18n to be ready
    await importx(__dirname + '/{events,commands,api}/**/*.{ts,js}');
    await client.login(`${process.env.DISCORD_BOT_TOKEN}`);
}

start().catch((error) => {
    if (error.code === 'TokenInvalid') {
        logger.error(
            `--- Invalid token provided ---
        Please provide a valid bot token in the DISCORD_BOT_TOKEN environment variable.
        If you don't have a bot token yet, you can create a new bot here: https://discord.com/developers/application

        Once you have the token, you can set it in the .env file using a program like Notepad or Sublime Text:
        
        DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN        <--- Replace "your-token-here" with your bot token
        `
        );
    } else {
        logger.error(error);
    }
    process.exit(1);
});
