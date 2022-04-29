export interface MonthInfo {
  noOfDays: number;
  startGridColumn: number;
  endGridColumn: number;
}

export enum Months {
  JAN = 'JAN',
  FEB = 'FEB',
  MAR = 'MAR',
  APR = 'APR',
  MAY = 'MAY',
  JUN = 'JUN',
  JUL = 'JUL',
  AUG = 'AUG',
  SEP = 'SEP',
  OCT = 'OCT',
  NOV = 'NOV',
  DEC = 'DEC',
}

export type CalendarMonthInfo = Record<Months, MonthInfo>;
