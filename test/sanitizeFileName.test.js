// imports
import should from 'should';
import _ from 'lodash';

import {sanitizeFileName} from '../index';

describe('sanitizeFileName', () => {
    it('should format Strings correctly', () => {
        // Key Value Map of uri -> isResourceUri
        const tests = [
            // origin ---- formatted
            ['oxofrmble', 'oxofrmble'],
            ['oxöfrämble', 'oxoframble'],
            ['<oxo|{[¢$frmble?', 'oxo_frmble'],
            ['<oxo|{[¢$frmble?', 'oxo_frmble.csv', {ensureType: 'csv'}],
            ['<oxo|{[¢$frmble?.csv', 'oxo_frmble.csv', {ensureType: 'csv'}],
            ['.csv', '.csv', {ensureType: 'csv'}],
        ];

        _.forEach(tests, value => {
            const originString = value[0];
            const formattedString = value[1];
            const options = value[2] || {};

            should(sanitizeFileName(originString, options)).equal(
                formattedString
            );
        });
    });
});
