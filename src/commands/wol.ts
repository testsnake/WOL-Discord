import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';

import { devicePermission, wake, sendPing, ActionResult } from '../deviceManager';
import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { deviceAutoComplete, rateLimitMessage } from '../utils';
import { commandLocalisation, commandDescription } from '../utils';
import { getTfunc } from '../i18n';
import config from '../config.json';
import logger from '../logger';

const requiredPermissions: devicePermission = {
    wol: true
};

const requiredPingPermissions: devicePermission = {
    ping: true
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
            descriptionLocalizations: commandLocalisation('wol.option', 'description'),
            required: true,
            type: ApplicationCommandOptionType.String
        })
        searchText: string,
        interaction: CommandInteraction
    ): Promise<void> {
        const isEphemeral = interaction.guild ? true : false;
        // Command Handler
        await interaction.deferReply({ ephemeral: isEphemeral });

        const t = getTfunc(interaction.locale);

        const result = await wake(searchText, interaction, requiredPermissions);
        interaction.editReply(
            t(`commands:wol.deviceResponse`, {
                context: result.mac && config.showDeviceMac ? `${result.result}_mac` : result.result,
                device: result.device,
                mac: result.mac
            })
        );

        if (config.checkPingAfterWake) {
            // Wait 30 seconds, ping check
            setTimeout(async () => {
                const pingResult = await sendPing(searchText, interaction, requiredPingPermissions);
                if (typeof pingResult !== 'object') {
                    if (pingResult === ActionResult.PermissionDenied) {
                        // Permission denied
                        return;
                    }
                    interaction.followUp({
                        content: t(`common:command.errorTitle`, {
                            error: t(`commands:ping.error`, { context: pingResult })
                        }),
                        ephemeral: isEphemeral
                    });
                } else {
                    logger.debug(`${pingResult.alive}_false`);
                    interaction.followUp({
                        content: t(`commands:ping.deviceResponse`, {
                            context: `${pingResult.alive}_false`,
                            avg: pingResult.avg,
                            max: pingResult.max,
                            min: pingResult.min,
                            packetLoss: pingResult.packetLoss
                        }),
                        ephemeral: isEphemeral
                    });
                }
            }, config.waitTimeAfterWake * 1000);
        }
    }
}
