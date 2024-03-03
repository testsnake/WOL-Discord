import { Locale } from 'discord.js';
import i18n from 'i18next';
import FsBackend, { FsBackendOptions } from 'i18next-fs-backend';
import { CommandStringType } from './utils';
import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';

const i18nReady = i18n.use(FsBackend).init<FsBackendOptions>({
    debug: true,
    fallbackLng: 'en',
    load: 'all',
    preload: readdirSync(join(__dirname, './locales')).filter((fileName) => {
        const joinedPath = join(join(__dirname, './locales'), fileName);
        const isDirectory = lstatSync(joinedPath).isDirectory();
        return isDirectory;
    }),
    backend: {
        loadPath: join(__dirname, './locales/{{lng}}/{{ns}}.json')
    },
    ns: ['common', 'commands'],
    defaultNS: 'common',
    interpolation: {
        escapeValue: false
    },
    returnEmptyString: false
});

function getTfunc(Locale: Locale) {
    return i18n.getFixedT(Locale);
}

function getCommandString(key: string, type: CommandStringType, locale: Locale) {
    return i18n.t(`${key}.${type}`, { ns: 'commands', lng: locale });
}

export { i18n, i18nReady, getTfunc, getCommandString };
