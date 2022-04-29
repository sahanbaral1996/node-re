import { compose, last, split } from 'ramda';

export function getToken(prefix: string, value: string) {
  return compose<string, string[], string | undefined>(last, split(`${prefix} `))(value);
}
