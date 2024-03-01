import { RateLimit, TIME_UNIT } from "@discordx/utilities";
import { AutocompleteInteraction, CacheType, CommandInteraction } from "discord.js";
import logger from "./logger";
import { GuardFunction } from "discordx";

function rateLimitMessage(
    this: void,
    interaction: CommandInteraction,
    timeLeft: number,
  ): Promise<string> {
    setTimeout(() => {
      interaction.deleteReply();
    }, timeLeft);

    return Promise.resolve(
      `Try again <t:${Math.floor(
        (Date.now() + timeLeft) / 1000,
      )}:R>`,
    );

}

export { rateLimitMessage }