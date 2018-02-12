// imports
import should from 'should';
import _ from 'lodash';

import {URI} from '../index';

describe('URI', () => {
    it('should parse URIs correctly', () => {
        should(new URI('http://example.org:80').normalize().toString()).equal(
            'http://example.org/'
        );
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

        _.forEach(tests, value => {
            const url = value[0];
            const isResourceUri = value[1];

            should(new URI(url).is('resourceURI')).equal(
                isResourceUri,
                `${url} should ${
                    isResourceUri ? '' : 'not'
                } recognized as an resourceURI`
            );
        });
    });
});
