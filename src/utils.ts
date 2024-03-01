import { RateLimit, TIME_UNIT } from "@discordx/utilities";
import { AutocompleteInteraction, CacheType, CommandInteraction } from "discord.js";
import logger from "./logger";
import { GuardFunction } from "discordx";

const rateLimitGuard = (time: number) =>  {
    // const l: GuardFunction<CommandInteraction<CacheType>> = async (interaction, client, next) => {
    //     if (interaction.isAutocomplete()) {
    //         logger.debug("Autocomplete interaction");
    //         return next();
    //     }
    //     logger.debug("Command interaction");
    // }  
    // return l;
    return RateLimit(TIME_UNIT.seconds, time, {
        ephemeral: true,
        message: rateLimitMessage,
    })
}

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

export { rateLimitGuard }