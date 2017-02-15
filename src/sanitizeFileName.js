import _ from 'lodash';

// remove all not common letters and characters from string
export const sanitizeFileName = function(string) {
    string = _.chain(string)
    // convert to basic latin letters
    .deburr()
    // replace all not-words (like '[') with '_'
    .replace(/\W/g, '_')
    // remove multiple '_'
    .replace(/_+/g, '_')
    // remove '_' from start and end
    .trim('_')
    .value()

    // return
    return string;
};