// imports
import should from 'should';

import {URITemplate} from '../index';

describe('URITemplate', () => {
    it('should expands URIs correctly', () => {
        should(
            new URITemplate('http://example.org:{port}').expand({port: 4444})
        ).equal('http://example.org:4444');
    });
});
