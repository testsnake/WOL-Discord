import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';
import { devicePermission, sendPing } from '../deviceManager';
import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { deviceAutoComplete, rateLimitMessage } from '../utils';
import { commandLocalisation, commandDescription } from '../utils';
import { getTfunc } from '../i18n';
import config from '../config.json';

const requiredPermissions: devicePermission = {
    ping: true
};

@Discord()
@Guard(
    RateLimit(TIME_UNIT.seconds, 5, {
        ephemeral: true,
        message: rateLimitMessage,
        rateValue: 5
    })
)
export class Ping {
    @Slash({
        name: 'ping',
        description: commandDescription('ping'),
        nameLocalizations: commandLocalisation('ping', 'name'),
        descriptionLocalizations: commandLocalisation('ping', 'description'),
        defaultMemberPermissions: ['Administrator'],
        dmPermission: true
    })
    private async ping(
        @SlashOption({
            autocomplete: deviceAutoComplete(requiredPermissions),
            name: 'device',
            description: commandDescription('ping.option'),
            nameLocalizations: commandLocalisation('ping.option', 'name'),
            descriptionLocalizations: commandLocalisation('ping.option', 'description'),
            required: false,
            type: ApplicationCommandOptionType.String
        })
        searchText: string,
        interaction: CommandInteraction
    ): Promise<void> {
        const sent = await interaction.deferReply({
            ephemeral: interaction.guild ? true : false,
            fetchReply: true
        });
        let t = getTfunc(interaction.locale);
        if (!searchText) {
            let responseTime = sent.createdTimestamp - interaction.createdTimestamp;
            interaction.editReply(t('commands:ping.botResponse', { Latency: responseTime }));
            return;
        }
        const result = await sendPing(searchText, interaction, requiredPermissions);
        // check if result is an ActionResult
        if (typeof result !== 'object') {
            interaction.editReply(
                t(`common:command.errorTitle`, {
                    error: t(`commands:ping.error`, { context: result })
                })
            );
        } else {
            interaction.editReply(
                t('commands:ping.deviceResponse', {
                    context: `${result.alive}_${config.showDeviceIP}`,
                    host: result.host,
                    avg: result.avg,
                    max: result.max,
                    min: result.min,
                    packetLoss: result.packetLoss
                })
            );
        }
    }
}
