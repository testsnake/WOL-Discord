import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction } from "discord.js";
import { Discord, Guard, Slash, SlashOption } from "discordx";
import config from "../config.json";
import { devicePermission, searchDevices, wol } from "../deviceManager";
import { RateLimit, TIME_UNIT } from "@discordx/utilities";
import { rateLimitGuard } from "../utils";

const requiredPermissions: devicePermission = {
    wol: true
};

@Discord()
@Guard(rateLimitGuard(30))
export class WakeOnLan {
    @Slash({
        name: "wol",
        description: "Wake up a computer using Wake-on-LAN"
    })
    
    private async wol(
        @SlashOption({
            autocomplete: true,
            description: "The name of the device to wake up",
            name: "device",
            required: true,
            type: ApplicationCommandOptionType.String
        }) searchText: string,
        interaction: CommandInteraction | AutocompleteInteraction
    ): Promise<void> {
        if (interaction.isAutocomplete()) {
            // Autocomplete Handler
            
            if (interaction.inGuild() && !config.allowCommandsInGuilds) {
                // Not allowed to use commands in guilds
                // Return an empty array to indicate that no results were found
                interaction.respond([]);
                return;
            } else {
                // Get the user's ID and required permissions
                const userId = interaction.user.id;
                
                // Search for devices
                const devices = searchDevices(searchText, userId, requiredPermissions);
                
                // Return the results
                interaction.respond(devices);
            }
            
        } else {
            
            // Command Handler
            //interaction.deferReply();

            // Get the device ID
            const deviceId = searchText;

            // Wake up the device
            const result = wol(deviceId, interaction, requiredPermissions);

            // Send the result
            interaction.reply("peepeepoopoo")
        }
    }
}