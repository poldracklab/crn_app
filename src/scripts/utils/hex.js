/**
 * Hex
 *
 * Utils for dealing with hex encoding
 */
export default {

    toASCII(hexString) {
        var hex  = hexString.toString();
        var str = '';
        for (var n = 0; n < hex.length; n += 2) {
            str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
        }
        return str;
    }

};