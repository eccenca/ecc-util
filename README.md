# @eccenca/utils collection

A set of small utility function that may not fit in any other package.

## uuid

Creates a `v4` uuid.
Is basically a wrapper around the npm package `uuid`.
For options see [here](https://github.com/kelektiv/node-uuid#uuidv4options--buffer--offset)

```js
import {uuid} from '@eccenca/utils';

const id = uuid();

```

## URI

Wrapper around [URI.js](https://github.com/medialize/URI.js).

```js

import {URI} from '@eccenca/utils'

const newURI = new URI('http://example.org');

//Our wrapper adds this check:
//Returns true if URI is urn-like or an absolute URL
newURI.is('resourceURI');

```

## changeFavicon

Change a favicon of a website dynamically.

```js
import {changeFavicon} from '@eccenca/utils';

changeFavicon(
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEUAAAD+jwHRIVMHAAAAAXRSTlMAQObYZgAAAHlJREFU" +
"CNctzbEJAzEQRNF/KBAGw6aOtG04EHJbFwisElzSlqISFCo4Tl7sg+EFE8yADC6C/biDzgTvs8A6K9s6JmHcBtFCR1o0BPmgD32SctkppVayzkyW4cTuBH" +
"O25uBJsP9RmEhjILb5aI+dMNX8aDVYC3gdjvdfRm8rdNXB000AAAAASUVORK5CYII="
);
```

## getBrowserLocales

Retrieve preferred locales by the user. Values are read from the `window.navigator` object

```js
import {getBrowserLocales} from '@eccenca/utils';

//Returns for example ['de-AT', 'de', 'en']
getBrowserLocales();
```

## getBestLocale

Returns best match between a list of preferred locales and supported locales.
Preferred locales default to `getBrowserLocales` and order is important (First in array is most important locale).
If no match can be found a default locale will be returned.

```js
import {getBestLocale} from '@eccenca/utils';

//returns 'en' (default value)
getBestLocale();

//returns 'de' (default value)
getBestLocale({defaultLocale: 'de'});

//suppose a user has a preference of ['de-AT', 'en'] in their browser
//returns 'de'
getBestLocale({supportedLocales: ['de', 'en']});

//returns 'en-AU'
getBestLocale({
    preferredLocales: ['de-AT', 'en'],
    supportedLocales: ['en-AU', 'ru-RU'],
});

//Sometimes order matters in supportedLocales
//suppose a user has a preference of ['en-US', 'de'] in their browser
//returns 'en'
getBestLocale({supportedLocales: ['en', 'en-AU', 'de']});
//returns 'en-AU'
getBestLocale({supportedLocales: ['en-AU', 'en', 'de']});
```

## sanitizeFileName

Transform all not common letters like 'ö,ä,ü,é' to standard latin and replace all special characters like '$,],¶' to a single '_' from a given string.
Has optional parameter `ensureType` in options

```js
import {sanitizeFileName} from '@eccenca/utils';

string = '<oxo|{[¢$frmble?.csv';
//Returns 'oxo_frmble.csv'
sanitizeFileName(string, {ensureType: 'csv'});
```

## convertSpringPropertyObject

Helps to convert Spring Property Objects to proper Javascript Objects

```js
    const input = {
        'foo.bar.string': '123',
        'foo.bar.array': ["a", "b", "c"],
        '[http://example.org]foo.bar': {
            'a.b': 12
        }
    };

    const output =
        {
            "foo": {
                "bar": {
                    "array": [
                        "a",
                        "b",
                        "c",
                    ],
                    "string": "123"
                }
            },
            "http://example.org": {
                "foo": {
                    "bar": {
                        "a": {
                            "b": 12
                        }
                    }
                }
            }
        }
    ;

    should(convertSpringPropertyObject(input)).deepEqual(output);
```
