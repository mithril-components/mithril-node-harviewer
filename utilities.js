// Defines that JS code should be executed in "strict mode".
"use strict";

/**
* All utilities functions. 
*/

// Return a string with the byte precision.
const sizePrecision = (size) => {
    if (!size)
        return "----";

    size = size < 0 ? 0 : size;

    if (size > 1099511627776) {
        return (size / 1099511627776).toPrecision(3) + "TB";
    }
    else if (size > 1073741824) {
        return (size / 1073741824).toPrecision(3) + "GB";
    }
    else if (size > 1048576) {
        return (size / 1048576).toPrecision(3) + "MB";
    }
    else if (size > 1024) {
        return (size / 1024).toPrecision(3) + "KB";
    }
    else {
        return size + "B";
    }
}

// Return a string with the time precision.
const timePrecision = (time) => {
    if (!time)
        return "----";

    time = time < 0 ? 0 : time;

    if (time > 1000) {
        return (time / 1000).toPrecision(3) + " s";
    }
    else {
        return time + " ms";
    }
}

// Export all previous functions.
module.exports = {
    sizePrecision,
    timePrecision
}