import { Locale } from 'discord.js';
import i18n from 'i18next'
import FsBackend, { FsBackendOptions } from 'i18next-fs-backend'
import { ComamandStringType } from './utils';

const i18nReady = i18n.use(FsBackend)
    .init<FsBackendOptions>({
        debug: true, 
        fallbackLng: 'en',
        lng: 'en',
        backend: {
            loadPath: './build/locales/{{lng}}/{{ns}}.json'
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

function getCommandString(key: string, type: ComamandStringType, locale: Locale) {
    return i18n.t(`${key}.${type}`, { ns: 'commands', lng: locale });
}

export { i18n, i18nReady, getTfunc, getCommandString };