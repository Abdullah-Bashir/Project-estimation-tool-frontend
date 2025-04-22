// components/fixPdfMakeCrypto.js
if (typeof window !== "undefined") {
    window.crypto = {
        getRandomValues: (buffer) => {
            const bytes = crypto.randomBytes(buffer.length);
            buffer.set(bytes);
            return buffer;
        }
    };
}