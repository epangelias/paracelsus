export const Meth = {
  async hash(text: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  },
  code(length = 0) {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    let hexString = '';
    for (let i = 0; i < randomBytes.length; i++) {
      const byte = randomBytes[i].toString(16).padStart(2, '0');
      hexString += byte;
    }
    if (!length) return hexString;
    return hexString.slice(0, length);
  },
  async copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_e) {}
  },
  objectEquals(x: unknown, y: unknown) {
    if (x === y) return true;
    if (!(x instanceof Object) || !(y instanceof Object)) return false;
    if (x.constructor !== y.constructor) return false;
    for (var p in x) {
      if (!x.hasOwnProperty(p)) continue;
      if (!y.hasOwnProperty(p)) return false;
      if (x[p] === y[p]) continue;
      if (typeof (x[p]) !== 'object') return false;
      if (!Meth.objectEquals(x[p], y[p])) return false;
    }

    for (p in y) {
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false;
      }
    }

    return true;
  },

  isEmoji(text: string) {
    return /\p{Emoji}/u.test(text);
  },

  emojiToUrl(icon: string) {
    return Meth.isEmoji(icon)
      ? `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${icon}</text></svg>`
      : icon;
  },
  limitText(text?: string, length: number = 20) {
    if (!text) return '';
    if (text.length > length) return text.slice(0, length - 3) + '...';
    return text;
  },
};
