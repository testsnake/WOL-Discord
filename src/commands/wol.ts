import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Guard, Slash, SlashOption } from "discordx";

import { devicePermission, wol } from "../deviceManager";
import { RateLimit, TIME_UNIT } from "@discordx/utilities";
import { deviceAutoComplete, rateLimitMessage } from "../utils";
import { commandLocalisation, commandDescription } from "../utils";

const requiredPermissions: devicePermission = {
    wol: true
};

@Discord()
@Guard(RateLimit(TIME_UNIT.seconds, 30, {
    ephemeral: true,
    message: rateLimitMessage,
}))
export class WakeOnLan {
    @Slash({
        name: "wol",
        description: commandDescription("wol"),
        nameLocalizations: commandLocalisation("wol", "name"),
        descriptionLocalizations: commandLocalisation("wol", "description"),
    })
    
    private async wol(
        @SlashOption({
            autocomplete: deviceAutoComplete(requiredPermissions),
            name: "device",
            description: commandDescription("wol.option"),
            nameLocalizations: commandLocalisation("wol.option", "name"),
            descriptionLocalizations: commandLocalisation("wol.option", "description"),
            required: true,
            type: ApplicationCommandOptionType.String
        }) searchText: string,
        interaction: CommandInteraction 
    ): Promise<void> {
            
        // Command Handler
        interaction.deferReply({ ephemeral: true });

        // Get the device ID
        const deviceId = searchText;

        // Wake up the device
        const result = await wol(deviceId, interaction, requiredPermissions);

        interaction.editReply("not implemented yet!")
    }
}