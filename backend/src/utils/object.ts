import { assoc, curry, keys, reduce, toPairs, compose, map, fromPairs } from 'ramda';
import camelcaseKeys from 'camelcase-keys';

import { toSnakeCase } from './string';

/**
 *
 * @param {Object} keysMap
 * @param {Object} inputObject
 */
export const renameKeys = curry((keysMap: Record<string, any>, inputObject: Record<string, string>) =>
  reduce((acc, key) => assoc(keysMap[key] || key, inputObject[key], acc), {}, keys(inputObject))
);

export interface INameValuePairs {
  Name: string;
  Value: string;
}

export const toSnakeCaseAttrNameValuePairs = compose<Record<string, any>, [string, any][], INameValuePairs[]>(
  map(([key, value]) => ({ Name: toSnakeCase(key), Value: `${value}` })),
  toPairs
);

export const toSnakeCaseAttrs = compose<Record<string, any>, [string, any][], [string, any][], Record<string, any>>(
  fromPairs,
  map(([key, value]) => [toSnakeCase(key), value]),
  toPairs
);

export function toCamelKeys<T>(input: Record<string, any>): T {
  return camelcaseKeys(input, { deep: true }) as T;
}

export function toCamelCaseObjectFromNameValuePairs<T>(pairs: INameValuePairs[]) {
  const output = {};

  pairs.reduce((accumulator, { Name, Value }) => {
    accumulator[Name] = Value;
    return accumulator;
  }, output);

  return camelcaseKeys(output) as T;
}
