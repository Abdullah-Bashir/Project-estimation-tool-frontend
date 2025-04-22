// components/fixPdfMakeCrypto.js
import * as crypto from "crypto-js";

if (typeof window !== "undefined" && !window.crypto) {
    window.crypto = {
        getRandomValues: (arr) => {
            const randomWords = crypto.lib.WordArray.random(arr.length);
            for (let i = 0; i < arr.length; i++) {
                arr[i] = (randomWords.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            }
            return arr;
        },
    };
}
