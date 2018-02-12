import _ from 'lodash';

const splitKey = key => {
    if (_.isArray(key)) {
        return key;
    }

    if (_.isNumber(key)) {
        return [key];
    }

    if (_.isString(key)) {
        let search = key;

        let r = [];

        while (search.length > 0) {
            const nextBracket = search.indexOf('[');
            const nextClosing = search.indexOf(']');
            const nextDot = search.indexOf('.');

            // If string contains no brackets, we split at every dot
            if (nextBracket === -1) {
                r = _.concat(r, search.split('.'));
                search = '';
            } else if (nextDot > -1 && nextDot < nextBracket) {
                // If string contains brackets, and a dot earlier, we break at the dot and are going to loop through
                const partialKey = search.substring(0, nextDot);
                r.push(partialKey);
                search = search.substring(nextDot + 1);
            } else if (nextBracket > -1 && nextClosing > -1) {
                // If the code contains two brackets, we extract everything between them
                const first = search.substring(0, nextBracket);
                const second = search.substring(nextBracket + 1, nextClosing);

                if (first !== '') {
                    r.push(first);
                }

                r.push(second);

                search = search.substring(nextClosing + 1);
            } else {
                r.push(search);
                search = '';
            }
        }

        return r;
    }

    return undefined;
};

const setSpringValue = (result, initialKey, value) => {
    const key = splitKey(initialKey);

    if (_.isPlainObject(value) || _.isArray(value)) {
        _.forEach(value, (v, k) =>
            setSpringValue(result, _.concat(key, splitKey(k)), v)
        );
    } else {
        _.set(result, key, value);
    }
};

const convertSpringPropertyObject = obj =>
    _.reduce(
        obj,
        (result, value, key) => {
            setSpringValue(result, key, value);

            return result;
        },
        {}
    );

export {convertSpringPropertyObject, splitKey};
