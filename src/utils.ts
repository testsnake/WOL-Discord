import {
    CommandInteraction,
    LocalizationMap,
    Locale,
    AutocompleteInteraction
} from 'discord.js';
import logger from './logger';
import { getTfunc, getCommandString } from './i18n';
import config from './config.json';
import { devicePermission, searchDevices } from './deviceManager';

function rateLimitMessage(
    this: void,
    interaction: CommandInteraction,
    timeLeft: number
): Promise<string> {
    // Delete message after timeout
    setTimeout(() => {
        try {
            interaction.deleteReply();
        } catch (error) {
            logger.error(error);
        }
    }, timeLeft);

    let t = getTfunc(interaction.locale);

    return Promise.resolve(
        t('common:command.timeout', {
            time: `<t:${Math.floor((interaction.createdTimestamp + timeLeft) / 1000)}:R>`
        })
    );
}

type ComamandStringType = 'name' | 'description';

function commandLocalisation(
    key: string,
    type: ComamandStringType
): LocalizationMap {
    const localeMap: LocalizationMap = {};
    for (const locale of Object.values(Locale)) {
        localeMap[locale] = getCommandString(key, type, locale as Locale);
        if (type === 'name') {
            localeMap[locale] = localeMap[locale]?.toLowerCase();
        }
    }
    return localeMap;
}

function commandDescription(key: string): string {
    return getCommandString(key, 'description', Locale.EnglishUS) ?? '';
}

function deviceAutoComplete(
    permissions: devicePermission
): (interaction: AutocompleteInteraction) => void {
    return (interaction: AutocompleteInteraction) => {
        if (interaction.inGuild() && !config.allowCommandsInGuilds) {
            // Not allowed to use commands in guilds
            // Return an empty array to indicate that no results were found
            interaction.respond([]);
            return;
        } else {
            // Get user input
            const focusedValue = interaction.options.getFocused();

            // Get the user's ID and required permissions
            const userId = interaction.user.id;

            // Search for devices
            const devices = searchDevices(focusedValue, userId, permissions);

            // Return the results
            interaction.respond(devices);
        }
    };
}

export {
    rateLimitMessage,
    ComamandStringType,
    commandDescription,
    commandLocalisation,
    deviceAutoComplete
};
