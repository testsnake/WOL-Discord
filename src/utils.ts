import { CommandInteraction, LocalizationMap, Locale } from "discord.js";
import logger from "./logger";
import { i18nReady, getTfunc, getCommandString } from "./i18n";


function rateLimitMessage(
    this: void,
    interaction: CommandInteraction,
    timeLeft: number,
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
      t('common:command.timeout', { time: `<t:${Math.floor((Date.now() + timeLeft) / 1000,)}:R>`})
    );

}

type ComamandStringType = "name" | "description";

function commandLocalisation(key: string, type: ComamandStringType): LocalizationMap {
  const localeMap: LocalizationMap = {};
  for (const locale of Object.values(Locale)) {
    localeMap[locale] = getCommandString(key, type, locale as Locale);
    if (type === "name") {
      localeMap[locale] = localeMap[locale]?.toLowerCase();
    }
  }
  return localeMap;
}

export { rateLimitMessage, ComamandStringType, commandLocalisation }