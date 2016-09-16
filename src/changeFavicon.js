
// dynamically changes favicon
export const changeFavicon = function(src) {

    // polyfill getting head for older browsers
    const head = document.head || document.getElementsByTagName('head')[0];

    // create new link
    const link = document.createElement('link');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.type = 'image/x-icon';
    link.href = src;

    // get old link and delete if present
    const oldLink = document.getElementById('dynamic-favicon');
    if (oldLink) {
        head.removeChild(oldLink);
    }
    // append new
    head.appendChild(link);
};
