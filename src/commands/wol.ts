import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction } from "discord.js";
import { Discord, Guard, Slash, SlashOption } from "discordx";

import { devicePermission, searchDevices, wol } from "../deviceManager";
import { RateLimit, TIME_UNIT } from "@discordx/utilities";
import { deviceAutoComplete, rateLimitMessage } from "../utils";
import { commandLocalisation } from "../utils";

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
        description: "Wake up a computer using Wake-on-LAN",
        nameLocalizations: commandLocalisation("wol", "name"),
        descriptionLocalizations: commandLocalisation("wol", "description"),
    })
    
    private async wol(
        @SlashOption({
            autocomplete: deviceAutoComplete(requiredPermissions),
            description: "The name of the device to wake up",
            name: "device",
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
        const result = wol(deviceId, interaction, requiredPermissions);

        setTimeout(() => {
            interaction.editReply("result");
        }, 1000);
        // Send the result
        
        
    }
}