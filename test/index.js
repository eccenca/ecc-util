/* global describe, it, before, global */
// imports
import should from 'should';
import sinon from 'sinon';
import _ from 'lodash';

import {changeFavicon, getBestLocale, getBrowserLocales, uuid, URI} from '../index';

// main test suite
describe('changeFavicon', () => {

    beforeEach(() => {
        global.document = {
            createElement: sinon.stub().returns({}),
            getElementById: sinon.stub(),
            getElementsByTagName: sinon.stub(),
            head: {
                appendChild: sinon.stub(),
                removeChild: sinon.stub(),
            }
        }
    });

    afterEach(() => {
        delete global.document;
    });

    it('should exist', () => {
        // check object
        should.exist(changeFavicon);
    });

    it('should append an favicon to the document head', () => {
        document.getElementById.returns(null);
        changeFavicon('foo');
        sinon.assert.calledOnce(document.createElement);
        sinon.assert.calledOnce(document.getElementById);
        sinon.assert.notCalled(document.head.removeChild);
        sinon.assert.calledOnce(document.head.appendChild);
    });

    it('should remove an old favicon from the document head if existing and add a new one', () => {
        document.getElementById.returns(true);
        changeFavicon('foo');
        sinon.assert.calledOnce(document.createElement);
        sinon.assert.calledOnce(document.getElementById);
        sinon.assert.calledOnce(document.head.removeChild);
        sinon.assert.calledOnce(document.head.appendChild);
    });

    it('should use fallback api if document.head is not defined', () => {
        const head = document.head;
        delete document.head;
        document.getElementsByTagName.returns([head]);
        changeFavicon('foo');
        sinon.assert.calledOnce(document.getElementsByTagName);
        sinon.assert.calledOnce(document.createElement);
        sinon.assert.calledOnce(document.getElementById);
        sinon.assert.notCalled(head.removeChild);
        sinon.assert.calledOnce(head.appendChild);
    });

});

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
        should(getBrowserLocales()).deepEqual([userLanguage, browserLanguage, systemLanguage]);
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
        should(getBestLocale({supportedLocales: null, defaultLocale: 'de'})).eql('de');
        should(getBestLocale({preferredLocales: null, defaultLocale: 'fr'})).eql('fr');
        should(getBestLocale({supportedLocales: null, preferredLocales: null, defaultLocale: 'ru'})).eql('ru');
        should(getBestLocale({supportedLocales: ['en-au'], preferredLocales, defaultLocale: 'ru'})).eql('en-au');
        should(getBestLocale({supportedLocales: ['en-US'], preferredLocales, defaultLocale: 'ru'})).eql('en-US');
        should(getBestLocale({supportedLocales: ['en'], preferredLocales, defaultLocale: 'ru'})).eql('en');
        should(getBestLocale({supportedLocales: ['de', 'en-au'], preferredLocales, defaultLocale: 'ru'})).eql('en-au');
        should(getBestLocale({supportedLocales: ['en', 'en-au'], preferredLocales, defaultLocale: 'ru'})).eql('en');
        should(getBestLocale({supportedLocales: ['en-au', 'en'], preferredLocales, defaultLocale: 'ru'})).eql('en-au');
        should(getBestLocale({supportedLocales: ['de-AT'], preferredLocales, defaultLocale: 'ru'})).eql('de-AT');
        should(getBestLocale({supportedLocales: ['en'], preferredLocales, defaultLocale: 'ru'})).eql('en');

    });

    it('should add the defaultLocale to supportedLocales', () => {
        should(getBestLocale({
            supportedLocales: ['en-au'],
            preferredLocales: ['en-US'],
            defaultLocale: 'en-US'
        })).eql('en-US');
    });

    it('should throw an Error if defaultLocale parameter is not a string', () => {

        (function() {
            getBestLocale({defaultLocale: null})
        }).should.throw(/Invalid argument/);

        (function() {
            getBestLocale({defaultLocale: []})
        }).should.throw(/Invalid argument/);


    });

});

describe('uuid', () => {

    it('should generate a uuid matching the uuid scheme', () => {
        should(uuid()).match(/[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}/);
    });

    it('should generate a fixed uuid with the same seed', () => {
        should(uuid({
            random: [
                0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea,
                0x71, 0xb4, 0xef, 0xe1, 0x67, 0x1c, 0x58, 0x36
            ]
        })).equal('109156be-c4fb-41ea-b1b4-efe1671c5836');
    });

    it('should generate two different uuids in consecutive runs', () => {
        should(uuid()).not.equal(uuid());
    });

});

describe('URI', () => {
   it('should parse URIs correctly', () => {
      should((new URI('http://example.org:80')).normalize().toString()).equal('http://example.org/')
   });

    it('should monkeypatch `resourceURI` check', () => {

        // Key Value Map of uri -> isResourceUri
        const tests = [
            ['http://example.org:80', true],
            ['http://example.org', true],
            ['http:/example.org', true],
            ['urn:foo', true],
            ['urn', false],
            ['/docs/nope/lol', false],
            ['eier', false],
            ['urn:ütf-8ürn', true],
            ['mailto:foo@example.org', true],
            // UTF-8 in scheme is not allowed
            // See https://tools.ietf.org/html/rfc3987
            //      scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
            //      ALPHA  = %x41-5A / %x61-7A   ; A-Z / a-z (https://tools.ietf.org/html/rfc2234)
            ['prötöcol:data', false],
        ];

        _.forEach(tests, (value) => {

            const url = value[0];
            const isResourceUri = value[1];

            console.log(URI.parse(url));

            should((new URI(url)).is('resourceURI'))
                .equal(
                    isResourceUri,
                    `${url} should ${isResourceUri? '' : 'not'} recognized as an resourceURI`
                )
            ;
        });

    });

});
