import URI from 'urijs';

const oldIs = URI.prototype.is;

URI.prototype.is = function(what) {
    switch (what.toLowerCase()) {
        case 'resourceuri':
            return (
                oldIs.call(this, 'urn') ||
                (oldIs.call(this, 'url') && oldIs.call(this, 'absolute'))
            );
        default:
            return oldIs.call(this, what);
    }
};

export default URI;
