const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Options {
  type: string;
  value: string;
  min?: number;
  max?: number;
  email?: boolean;
  textAndSpaces?: boolean;
}

export function validation({ type, value, min, max, email, textAndSpaces }: Options) {
  if (min !== undefined && value.length < min) {
    throw new Error(`${type} must be at least ${min} characters`);
  }
  if (max !== undefined && value.length > max) {
    throw new Error(`${type} must be less than ${max} characters`);
  }
  if (email !== undefined && !regexEmail.test(value)) {
    throw new Error(`Invalid ${type}`);
  }
  if (textAndSpaces !== undefined && !/^[a-zA-Z\s]+$/.test(value)) {
    throw new Error(`${type} must only contain letters and spaces`);
  }
}
