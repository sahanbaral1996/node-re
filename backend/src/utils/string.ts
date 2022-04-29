import { concat } from 'ramda';

export const toSnakeCase = (input: string) => input.replace(/([A-Z])/g, x => concat('_', x.toLowerCase()));
