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

    if (size > 10000) {
        return (size / 1000).toPrecision(3) + "KB";
    }
    else if (size > 1000) {
        return (size / 1000).toPrecision(2) + "KB";
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
