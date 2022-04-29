import {
  format,
  endOfMonth,
  getDate,
  isLeapYear,
  parseISO,
  getYear,
  isSameMonth,
  startOfMonth,
  differenceInDays,
} from 'date-fns';
import { CalendarMonthInfo, Months } from 'types/date';
import { minTwoDigits } from './number';

import { MONTHS } from '../constants/dates';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';

/**
 * Get no of days in each month of the year.
 *
 * @example
 * getNoOfDaysInMonths('2019')
 * => [31, 29, ...]
 *
 * @param {string} year
 * @returns {Object}
 */
export function getNoOfDaysInMonths(year: string | number): CalendarMonthInfo | Record<string, never> {
  if (!year) {
    return {};
  }

  const months = {} as CalendarMonthInfo;
  let days = 0;

  for (let i = 0; i < 12; i++) {
    const month = minTwoDigits(i + 1);

    const noOfDays = getDate(endOfMonth(new Date(`${year}-${month}`)));

    const key = MONTHS[i] as Months;

    months[key] = {
      noOfDays: noOfDays,
      startGridColumn: days + 1,
      endGridColumn: days + noOfDays,
    };
    days += noOfDays;
  }

  return months;
}

/**
 * Formats the date in the format mm yyyy.
 *
 * @param {string|number|Date} value
 * @param {String} formatType
 */
export const formatDate = (value: string | number | Date, formatType: string) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  return format(date, formatType);
};

/**
 * Get numbers of days in a year.
 *
 * @param {date} year
 */
export const getNoOfDaysInYear = (year: number | Date): number => {
  return isLeapYear(year) ? 366 : 365;
};

/**
 * @param {Object} param
 * @param {String} param.earlier
 * @param {String} param.laterDate
 */
export const areInSameMonth = ({ earlierDate, laterDate }: { earlierDate: string; laterDate: string }) => {
  const parsedEarlierDate = parseISO(earlierDate);
  const parsedLaterDate = parseISO(laterDate);

  return isSameMonth(parsedEarlierDate, parsedLaterDate);
};

/**
 * @param {Object} param
 * @param {String} param.date
 * @param {String} param.formatType
 */
export const getStartDateOfMonth = ({ date, formatType }: { date: string; formatType: string }) => {
  const startDateOfMonth = startOfMonth(parseISO(date));

  return formatDate(startDateOfMonth, formatType);
};

export const getDurationInDaysBetweenDates = ({
  startDate,
  endDate,
}: {
  startDate: Date | string;
  endDate: Date | string;
}) => {
  let start: Date | null = null;
  let end: Date | null = null;

  if (typeof startDate === 'string') {
    start = new Date(startDate);
  } else {
    start = startDate;
  }
  if (typeof endDate === 'string') {
    end = new Date(endDate);
  } else {
    end = endDate;
  }

  return differenceInDays(end, start) + 1;
};

/**
 * Get date range from startdate to enddate.
 *
 * @example
 * getDateRange('01-29-2019', '03-01-2019)
 * => January 29 - March 1
 *
 * @example
 * getDateRange('12-29-2019', '01-01-2020)
 * => December 29 2019- January 1 2020
 *
 * @returns {String}
 * @param {String | Date} startDate
 * @param {String | Date} endDate
 */
export const getDateRange = (startDate: string | Date | undefined, endDate: string | Date | undefined) => {
  if (!startDate || !endDate) {
    return '';
  }

  const effectiveYear = getYear(new Date(startDate));
  const endYear = getYear(new Date(startDate));

  if (effectiveYear === endYear) {
    return `${format(new Date(startDate), 'MMMM dd')} - ${format(new Date(endDate), 'MMMM dd')}`;
  }

  return `${format(new Date(startDate), 'MMMM dd yyyy')} - ${format(new Date(endDate), 'MMMM dd yyyy')}`;
};

/**
 * Get number of days in the specified month.
 *
 * @returns {Array}
 * @param {Number} givenMonth
 * @param {Number} givenYear
 */
export const getDaysInMonth = (givenMonth: number, givenYear: number): number[] => {
  const TwentyNineDayMonths = [2];
  const ThirtyDayMonths = [4, 6, 9, 11];
  const DayList = Array.from({ length: 31 }, (_, idx) => idx + 1);

  if (TwentyNineDayMonths.includes(givenMonth)) {
    if (!isLeapYear(givenYear)) {
      return DayList.slice(0, 28);
    }

    return DayList.slice(0, 29);
  } else if (ThirtyDayMonths.includes(givenMonth)) {
    return DayList.slice(0, 30);
  }

  return DayList;
};

export const isBetweenDates = (start: Date, end: Date, inBetween: Date) =>
  isAfter(inBetween, start) && isBefore(inBetween, end);

export const isAfterDate = isAfter;

export const isBeforeDate = isBefore;
