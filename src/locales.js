import _ from 'lodash';

export const getBrowserLocales = () => {
    const browserLanguagePropertyKeys = [
        // Supported by FF and Chrome
        // https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages
        // languages contains an array of preferred languages ordered by preference
        // language is first element of the array above
        'languages',
        'language',
        // IE specific, returns locale of the user
        // https://msdn.microsoft.com/library/ms534713.aspx
        'userLanguage',
        // IE specific, returns current OPERATING system language (despite the name)
        // https://msdn.microsoft.com/en-us/library/ms533542.aspx
        'browserLanguage',
        // IE specific, returns current OPERATING system language
        // https://msdn.microsoft.com/en-us/library/ms534653(v=vs.85).aspx
        'systemLanguage',
    ];

    return _.chain(_.get(window, 'navigator', {}))
        .pick(browserLanguagePropertyKeys)
        .values()
        .flatten()
        .uniq()
        .value();
};

/**
 *
 * Returns the best matching locales for a given list
 *
 * @param {Object} [options] object that may be provided to configure getBestLocale
 * @param {Array} [options.supportedLocales=[]]  unordered list of supported locales in BCP 47 format
 * @param {Array} [options.preferredLocales=getBrowserLocales()]  ordered list of preferred locales in BCP 47 format
 * @param {String} [options.defaultLocale='en']  fallback locale in BCP 47 format
 * @returns {String} best matching locale in BCP 47 format
 * @see {@link https://www.ietf.org/rfc/bcp/bcp47.txt|BCP 47}
 */
export const getBestLocale = (options = {}) => {
    const {
        supportedLocales = [],
        preferredLocales = getBrowserLocales(),
        defaultLocale = 'en',
    } = options;

    if (!_.isString(defaultLocale)) {
        throw new Error(
            `Invalid argument: defaultLocale is not a string${defaultLocale}`
        );
    }

    if (_.isEmpty(supportedLocales)) {
        return defaultLocale;
    }

    supportedLocales.push(defaultLocale);

    let bestLocale = false;

    // Use some instead of forEach, so that we can break after the first match
    _.some(preferredLocales, preferred => {
        const prefLowerCase = preferred.toLocaleLowerCase();

        // Check if there is an exact match for the preferred locale
        bestLocale = _.find(
            supportedLocales,
            supported => prefLowerCase === supported.toLocaleLowerCase()
        );

        // If we found no match, we do some fuzzy checks
        if (!bestLocale) {
            // If the preferred language is something like 'en',
            // we check if we have a best match like 'en-US'
            if (prefLowerCase.length === 2) {
                bestLocale = _.find(
                    supportedLocales,
                    supported =>
                        prefLowerCase ===
                        supported.toLocaleLowerCase().substr(0, 2)
                );
            } else if (prefLowerCase.length > 2) {
                // If the preferred language is something like 'en-US',
                // we check if we have a best match like 'en-AU' or 'en'
                bestLocale = _.find(
                    supportedLocales,
                    supported =>
                        prefLowerCase.substr(0, 2) ===
                        supported.toLocaleLowerCase().substr(0, 2)
                );
            }
        }

        return _.isString(bestLocale);
    });

    return bestLocale || defaultLocale;
};
