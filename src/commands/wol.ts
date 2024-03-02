import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction } from "discord.js";
import { Discord, Guard, Slash, SlashOption } from "discordx";
import config from "../config.json";
import { devicePermission, searchDevices, wol } from "../deviceManager";
import { RateLimit, TIME_UNIT } from "@discordx/utilities";
import { rateLimitMessage } from "../utils";
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
            autocomplete: (interaction: AutocompleteInteraction) => {
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
                    AutocompleteInteraction
                    // Search for devices
                    const devices = searchDevices(focusedValue, userId, requiredPermissions);
                    
                    // Return the results
                    interaction.respond(devices);
                }
            },
            description: "The name of the device to wake up",
            name: "device",
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