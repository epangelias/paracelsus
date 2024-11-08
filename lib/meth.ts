export const Meth = {
    async hash(text: string) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
        return hashHex;
    },
    code(length = 0) {
        const randomBytes = new Uint8Array(32);
        crypto.getRandomValues(randomBytes);
        let hexString = "";
        for (let i = 0; i < randomBytes.length; i++) {
            const byte = randomBytes[i].toString(16).padStart(2, "0");
            hexString += byte;
        }
        if (!length) return hexString
        return hexString.slice(0, length);
    },
    async copy(text: string) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (_e) { }
    },
};