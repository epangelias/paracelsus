// @ts-nocheck Unresolved

export function objectEquals(x: unknown, y: unknown): boolean {
  let p;
  if (x === y) return true;
  if (!(x instanceof Object) || !(y instanceof Object)) return false;
  if (x.constructor !== y.constructor) return false;
  for (p in x) {
    if (!(p in x)) continue;
    if (!(p in y)) return false;
    if (x[p] === y[p]) continue;
    if (typeof x[p] !== 'object') return false;
    if (!objectEquals(x[p], y[p])) return false;
  }

  for (p in y) {
    if (p in y && !(p in x)) return false;
  }

  return true;
}

export function limitText(text?: string, length: number = 20): string {
  if (!text) return '';
  if (text.length > length) return text.slice(0, length - 3) + '...';
  return text;
}

export function formDataToObject<T = Record<string, string>>(formData: FormData): T {
  const result = {} as T;

  for (const [key, value] of formData.entries()) {
    result[key] = key in result ? [].concat(result[key]).concat(value) : value;
  }

  return result;
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = globalThis.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export function getErrorMessage(e: unknown): string {
  if (typeof e === 'string') return e as string;
  if ('message' in e) return e.message as string;
  return 'Unknown error';
}