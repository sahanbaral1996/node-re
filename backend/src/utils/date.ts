import { isSameDay } from 'date-fns';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';

export const isBetweenDates = (start: Date, end: Date, inBetween: Date) =>
  (isAfter(inBetween, start) || isSameDay(inBetween, start)) && (isBefore(inBetween, end) || isSameDay(inBetween, end));

export const isBeforeDate = (input: Date, beforeDate: Date) => isBefore(beforeDate, input);
