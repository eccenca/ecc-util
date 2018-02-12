// imports
import should from 'should';

import {uuid} from '../index';

describe('uuid', () => {
    it('should generate a uuid matching the uuid scheme', () => {
        should(uuid()).match(/[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}/);
    });

    it('should generate a fixed uuid with the same seed', () => {
        should(
            uuid({
                random: [
                    0x10,
                    0x91,
                    0x56,
                    0xbe,
                    0xc4,
                    0xfb,
                    0xc1,
                    0xea,
                    0x71,
                    0xb4,
                    0xef,
                    0xe1,
                    0x67,
                    0x1c,
                    0x58,
                    0x36,
                ],
            })
        ).equal('109156be-c4fb-41ea-b1b4-efe1671c5836');
    });

    it('should generate two different uuids in consecutive runs', () => {
        should(uuid()).not.equal(uuid());
    });
});
