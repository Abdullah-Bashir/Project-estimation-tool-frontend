// components/fixPdfMakeCrypto.js
import { Buffer } from 'buffer';
import { createHash } from 'crypto-browserify';

if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
    window.crypto = {
        getRandomValues: (arr) => crypto.getRandomValues(arr),
        subtle: {
            digest: (algorithm, data) => {
                const hash = createHash(algorithm.toLowerCase().replace('-', ''));
                hash.update(Buffer.from(data));
                return Promise.resolve(hash.digest());
            }
        }
    };
}