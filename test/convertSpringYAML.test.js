// imports
import should from 'should';

import {convertSpringPropertyObject} from '../index';

import {splitKey} from '../src/convertSpringPropertyObject';

describe('convertSpringYAMLPropertyObject', () => {
    it('should split property keys correctly', () => {
        should(splitKey('foo.bar')).deepEqual(['foo', 'bar']);
        should(splitKey('foo[bar]')).deepEqual(['foo', 'bar']);
        should(splitKey('[foo][bar]')).deepEqual(['foo', 'bar']);
        should(splitKey('foo[http://example.org]')).deepEqual([
            'foo',
            'http://example.org',
        ]);
        should(
            splitKey(
                'mdm.definitions[https://vocab.eccenca.com/auth/AccessCondition]'
            )
        ).deepEqual([
            'mdm',
            'definitions',
            'https://vocab.eccenca.com/auth/AccessCondition',
        ]);
        should(splitKey('[http://example.org]')).deepEqual([
            'http://example.org',
        ]);
        should(splitKey('http://example.org]')).deepEqual([
            'http://example',
            'org]',
        ]);
        should(splitKey('[http://example.org]foo.bar')).deepEqual([
            'http://example.org',
            'foo',
            'bar',
        ]);
        should(splitKey(['foo', 'bar'])).deepEqual(['foo', 'bar']);
        should(splitKey(1)).deepEqual([1]);
    });

    it('should convert a spring property object correctly', () => {
        const input = {
            'foo.bar.string': '123',
            'foo.bar.array': ['a', 'b', 'c'],
            '[http://example.org]foo.bar': {
                'a.b': 12,
            },
        };

        const output = {
            foo: {
                bar: {
                    array: ['a', 'b', 'c'],
                    string: '123',
                },
            },
            'http://example.org': {
                foo: {
                    bar: {
                        a: {
                            b: 12,
                        },
                    },
                },
            },
        };

        should(convertSpringPropertyObject(input)).deepEqual(output);
    });
});
