// imports
import should from 'should';

import {getBestLocale, getBrowserLocales} from '../index';

describe('getBrowserLocales', () => {
    const languages = ['de-AT', 'de'];
    const language = languages[0];
    const userLanguage = 'ru';
    const browserLanguage = 'en';
    const systemLanguage = 'fr';

    beforeEach(() => {
        global.window = {navigator: {}};
    });

    afterEach(() => {
        delete global.window;
    });

    it('should return empty array, if no locale is found', () => {
        should(getBrowserLocales()).deepEqual([]);
    });

    it('should read window.navigator.languages', () => {
        window.navigator.languages = languages;
        should(getBrowserLocales()).deepEqual(languages);
    });

    it('should read window.navigator.language', () => {
        window.navigator.language = language;
        should(getBrowserLocales()).deepEqual([language]);
    });

    it('should read window.navigator.userLanguage', () => {
        window.navigator.userLanguage = userLanguage;
        should(getBrowserLocales()).deepEqual([userLanguage]);
    });

    it('should read window.navigator.userLanguage', () => {
        window.navigator.browserLanguage = browserLanguage;
        should(getBrowserLocales()).deepEqual([browserLanguage]);
    });

    it('should read window.navigator.userLanguage', () => {
        window.navigator.systemLanguage = systemLanguage;
        should(getBrowserLocales()).deepEqual([systemLanguage]);
    });

    it('should read multiple properties in the correct order', () => {
        window.navigator = {
            userLanguage,
            systemLanguage,
            browserLanguage,
        };
        should(getBrowserLocales()).deepEqual([
            userLanguage,
            browserLanguage,
            systemLanguage,
        ]);
    });

    it('should read return a unique array', () => {
        window.navigator = {
            languages,
            language,
        };
        should(getBrowserLocales()).deepEqual(languages);
    });
});

describe('getBestLocale', () => {
    before(() => {
        global.window = {};
    });

    after(() => {
        delete global.window;
    });

    const preferredLocales = ['en-US', 'de'];

    it('return valid values', () => {
        should(getBestLocale()).eql('en');
        should(
            getBestLocale({supportedLocales: null, defaultLocale: 'de'})
        ).eql('de');
        should(
            getBestLocale({preferredLocales: null, defaultLocale: 'fr'})
        ).eql('fr');
        should(
            getBestLocale({
                supportedLocales: null,
                preferredLocales: null,
                defaultLocale: 'ru',
            })
        ).eql('ru');
        should(
            getBestLocale({
                supportedLocales: ['en-au'],
                preferredLocales,
                defaultLocale: 'ru',
            })
        ).eql('en-au');
        should(
            getBestLocale({
                supportedLocales: ['en-US'],
                preferredLocales,
                defaultLocale: 'ru',
            })
        ).eql('en-US');
        should(
            getBestLocale({
                supportedLocales: ['en'],
                preferredLocales,
                defaultLocale: 'ru',
            })
        ).eql('en');
        should(
            getBestLocale({
                supportedLocales: ['de', 'en-au'],
                preferredLocales,
                defaultLocale: 'ru',
            })
        ).eql('en-au');
        should(
            getBestLocale({
                supportedLocales: ['en', 'en-au'],
                preferredLocales,
                defaultLocale: 'ru',
            })
        ).eql('en');
        should(
            getBestLocale({
                supportedLocales: ['en-au', 'en'],
                preferredLocales,
                defaultLocale: 'ru',
            })
        ).eql('en-au');
        should(
            getBestLocale({
                supportedLocales: ['de-AT'],
                preferredLocales,
                defaultLocale: 'ru',
            })
        ).eql('de-AT');
        should(
            getBestLocale({
                supportedLocales: ['en'],
                preferredLocales,
                defaultLocale: 'ru',
            })
        ).eql('en');
    });

    it('should add the defaultLocale to supportedLocales', () => {
        should(
            getBestLocale({
                supportedLocales: ['en-au'],
                preferredLocales: ['en-US'],
                defaultLocale: 'en-US',
            })
        ).eql('en-US');
    });

    it('should throw an Error if defaultLocale parameter is not a string', () => {
        (() => {
            getBestLocale({defaultLocale: null});
        }).should.throw(/Invalid argument/);

        (() => {
            getBestLocale({defaultLocale: []});
        }).should.throw(/Invalid argument/);
    });
});
