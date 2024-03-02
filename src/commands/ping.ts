import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Guard, Slash, SlashOption } from "discordx";
import { devicePermission, ping } from "../deviceManager";
import { RateLimit, TIME_UNIT } from "@discordx/utilities";
import { deviceAutoComplete, rateLimitMessage } from "../utils";
import { commandLocalisation, commandDescription } from "../utils";
import { getTfunc } from "../i18n";
import logger from "../logger";

const requiredPermissions: devicePermission = {
    ping: true
};

@Discord()
@Guard(RateLimit(TIME_UNIT.seconds, 5, {
    ephemeral: true,
    message: rateLimitMessage,
    rateValue: 5
}))
export class Ping {
    @Slash({
        name: "ping",
        description: commandDescription("ping"),
        nameLocalizations: commandLocalisation("ping", "name"),
        descriptionLocalizations: commandLocalisation("ping", "description"),
    })
    private async ping(
        @SlashOption({
            autocomplete: deviceAutoComplete(requiredPermissions),
            name: "device",
            description: commandDescription("ping.option"),
            nameLocalizations: commandLocalisation("ping.option", "name"),
            descriptionLocalizations: commandLocalisation("ping.option", "description"),
            required: false,
            type: ApplicationCommandOptionType.String
        }) searchText: string,
        interaction: CommandInteraction
    ): Promise<void> {
        const sent = await interaction.deferReply({ ephemeral: true, fetchReply: true});
        if (!searchText) {
            let t = getTfunc(interaction.locale);
            let responseTime = sent.createdTimestamp - interaction.createdTimestamp;
            interaction.editReply(t('commands:ping.response', { Latency: responseTime }));
            return;
        }

        // interaction.deferReply({ ephemeral: true });

        const result = await ping(searchText, interaction, requiredPermissions);

        interaction.editReply("not implemented yet!")
    }
}