// Taken from https://github.com/vbarbarosh/node-helpers/blob/main/src/round.js

function round(value, precision = 1)
{
    if (precision === 0) {
        return value;
    }

    const factor = 1 / precision;
    const sign = Math.sign(value);

    // Count decimal places for the cleanup (toFixed)
    const exponent = get_decimal_places(precision);

    // Small epsilon helps fix most floating point edge cases involving ties
    const epsilon = 1e-12*sign;

    // Scale → Nudge → Round → Unscale
    const final = (Math.round(value*factor + epsilon) / factor);

    // Cleanup trailing garbage such as: 34.038000000000004 → 34.038
    return Number(final.toFixed(exponent));
}

function get_decimal_places(precision)
{
    if (Math.floor(precision) === precision) {
        return 0;
    }

    // Scientific notation support: e.g., 1e-20
    const e = precision.toExponential().split('e');
    if (e.length > 1) {
        return Math.abs(parseInt(e[1], 10));
    }

    // Normal decimal notation (e.g., 0.001)
    return precision.toString().split('.')[1]?.length || 0;
}

module.exports = round;
