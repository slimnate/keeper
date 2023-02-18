// Slugify a string
// credit: https://lucidar.me/en/web-dev/how-to-slugify-a-string-in-javascript/
function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, '');

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa--_---";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    // Remove invalid chars
    str = str.replace(/[^a-z0-9 -]/g, '') 
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-') 
    // Collapse dashes
    .replace(/-+/g, '-'); 

    return str;
}

function atomize(path) {
    return `atom://${path}`;
}

const rollingIncrement = (current, start, end, decrement = false) => {
    const change = decrement ? -1 : 1;

    // rotate from start to end
    if(decrement && current === start) return end;

    // rotate from end to start
    if(!decrement && current === end) return start;

    return current + change;
}

const helpers = {
    slugify,
    rollingIncrement,
    atomize,
}

module.exports = helpers;