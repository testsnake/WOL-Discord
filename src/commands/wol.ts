import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';

import { devicePermission, wake } from '../deviceManager';
import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { deviceAutoComplete, rateLimitMessage } from '../utils';
import { commandLocalisation, commandDescription } from '../utils';
import { getTfunc } from '../i18n';
import config from '../config.json';

const requiredPermissions: devicePermission = {
    wol: true
};

@Discord()
@Guard(
    RateLimit(TIME_UNIT.seconds, 30, {
        ephemeral: true,
        message: rateLimitMessage
    })
)
export class WakeOnLan {
    @Slash({
        name: 'wol',
        description: commandDescription('wol'),
        nameLocalizations: commandLocalisation('wol', 'name'),
        descriptionLocalizations: commandLocalisation('wol', 'description'),
        defaultMemberPermissions: ['Administrator'],
        dmPermission: true
    })
    private async wol(
        @SlashOption({
            autocomplete: deviceAutoComplete(requiredPermissions),
            name: 'device',
            description: commandDescription('wol.option'),
            nameLocalizations: commandLocalisation('wol.option', 'name'),
            descriptionLocalizations: commandLocalisation(
                'wol.option',
                'description'
            ),
            required: true,
            type: ApplicationCommandOptionType.String
        })
        searchText: string,
        interaction: CommandInteraction
    ): Promise<void> {
        // Command Handler
        await interaction.deferReply({ ephemeral: true });

        const t = getTfunc(interaction.locale);

        const result = await wake(searchText, interaction, requiredPermissions);
        interaction.editReply(
            t(`commands:wol.deviceResponse`, {
                context:
                    result.mac && config.showDeviceMac
                        ? `${result.result}_mac`
                        : result.result,
                device: result.device,
                mac: result.mac
            })
        );
    }
}
