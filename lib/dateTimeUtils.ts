import moment from "moment";

/**
 * Represents a range of dates with a start date (`from`) and an optional end date (`to`).
 *
 * @typedef {Object} DateRange
 * @property {Date | undefined} from - The start date of the range. It can be undefined.
 * @property {Date | undefined} [to] - The optional end date of the range. It can be undefined.
 */
export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

/**
 * Represents a unit of time.
 *
 * @typedef {('day' | 'week' | 'month')} TimeUnit
 *
 * @example
 * Example usage:
 * let unit: TimeUnit = 'day';
 *
 * @remarks
 * This type can be used to specify a time unit for various date and time operations.
 */
export type TimeUnit = "day" | "week" | "month";

/**
 * Returns the number of days in a given month of a specific year.
 *
 * @param monthIndex - The index of the month (0 for January, 11 for December).
 * @param year - The year for which to get the number of days in the month. Defaults to the current year.
 * @returns The number of days in the specified month and year.
 */
export function getDaysInMonth(
  monthIndex: number,
  year: number = new Date().getFullYear(),
): number {
  return moment({ year, month: monthIndex }).daysInMonth();
}

/**
 * Returns the index of the month for a given date.
 * If no date is provided, defaults to the current month.
 *
 * @param date - The date for which to get the month index. Defaults to the current date.
 * @returns The index of the month (0 for January, 11 for December).
 */
export function getMonthIndexForDate(date: Date = new Date()): number {
  return moment(date).month();
}

/**
 * Returns a matrix representing the days of the month for a given month index and year.
 * Each sub-array represents a week, and each element in the sub-array represents a day.
 *
 * @param monthIndex - The index of the month (0 for January, 11 for December).
 * @param year - The year for which to get the days matrix. Defaults to the current year.
 * @returns A matrix of days for the specified month and year.
 */
export function getDaysMatrix(
  monthIndex: number,
  year: number = new Date().getFullYear(),
): number[][] {
  const daysInMonth = getDaysInMonth(monthIndex, year);
  const firstDayOfMonth = moment({ year, month: monthIndex, day: 1 }).day();
  const weeks: number[][] = [];
  let currentWeek: number[] = [];

  // Fill the first week with leading days from the last month
  const previousMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
  const previousMonthYear = monthIndex === 0 ? year - 1 : year;
  const daysInPreviousMonth = getDaysInMonth(
    previousMonthIndex,
    previousMonthYear,
  );

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    currentWeek.push(daysInPreviousMonth - i);
  }

  // Fill the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Fill the last week with trailing days from the next month
  let nextMonthDay = 1;
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push(nextMonthDay++);
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

/**
 * Returns the start of the specified period (day, week, or month) for the given date.
 * Defaults to the current date if no date is provided.
 *
 * @param date - The date for which to get the start of the period. Defaults to the current date.
 * @param period - The period for which to get the start. Can be 'day', 'week', or 'month'.
 * @returns A new Date object representing the start of the specified period.
 */
export function getStartOfPeriod(
  date: Date = new Date(),
  period: TimeUnit,
): Date {
  return moment(date).startOf(period).toDate();
}

/**
 * Returns the end of the specified period (day, week, or month) for the given date.
 * Defaults to the current date if no date is provided.
 *
 * @param date - The date for which to get the end of the period. Defaults to the current date.
 * @param period - The period for which to get the end. Can be 'day', 'week', or 'month'.
 * @returns A new Date object representing the end of the specified period.
 */
export function getEndOfPeriod(
  date: Date = new Date(),
  period: TimeUnit,
): Date {
  return moment(date).endOf(period).toDate();
}

/**
 * Returns a date range object representing the start and end of the week for the given date.
 *
 * @param date - The date for which to get the week range.
 * @returns An object with 'from' as the start of the week and 'to' as the end of the week.
 */
export function getWeekDateRange(date: Date): DateRange {
  const from = getStartOfPeriod(date, "week");
  const to = getEndOfPeriod(date, "week");
  return { from, to };
}

/**
 * Returns whether the given date is in the specified date range.
 *
 * @param date - The date to check.
 * @param range - The date range to check against.
 * @param options - Additional options for the date range check.
 * @returns True if the date is in the range, false otherwise.
 */
export function isDateInRange(
  date: Date,
  range: DateRange,
  options: { excludeEnds?: boolean } = {},
): boolean {
  const { from, to } = range;
  const momentDate = moment(date);
  const momentFrom = moment(from).startOf("day");
  const momentTo = moment(to).startOf("day");

  if (options.excludeEnds) {
    return momentDate.isAfter(momentFrom) && momentDate.isBefore(momentTo);
  }

  return (
    momentDate.isSameOrAfter(momentFrom) && momentDate.isSameOrBefore(momentTo)
  );
}

/**
 * Adds a specified period to a given date.
 *
 * @param {Date} [date=new Date()] - The initial date to which the period will be added. Defaults to the current date if not provided.
 * @param {number} amount - The amount of the period to add.
 * @param {'day' | 'week' | 'month'} unit - The unit of the period to add. Can be 'day', 'week', or 'month'.
 * @returns {Date} - The new date with the added period.
 */
export function addPeriodToDate(
  date: Date = new Date(),
  amount: number,
  unit: TimeUnit,
): Date {
  return moment(date).add(amount, unit).toDate();
}

/**
 * Formats a given date according to the specified format string.
 *
 * @param date - The date to format. Defaults to the current date if not provided.
 * @param format - The format string to use for formatting the date.
 * @returns The formatted date string.
 */
export function formatDate(date: Date = new Date(), format: string): string {
  return moment(date).format(format);
}

/**
 * Formats a date range into a human-readable string.
 *
 * @param {DateRange} range - The date range to format.
 * @param {Date} range.from - The start date of the range.
 * @param {Date} range.to - The end date of the range.
 * @returns {string} A formatted string representing the date range.
 *
 * @throws {Error} Throws an error if neither 'from' nor 'to' dates are defined.
 *
 * The function handles the following cases:
 * - If only the 'from' date is defined, it returns the formatted 'from' date.
 * - If only the 'to' date is defined, it returns the formatted 'to' date.
 * - If both dates are defined and fall within the same month, it returns a range formatted as "DD - DD MMMM YYYY".
 * - If both dates are defined and fall within the same year but different months, it returns a range formatted as "DD MMMM - DD MMMM YYYY".
 * - If both dates are defined and fall in different years, it returns a range formatted as "DD MMMM YYYY - DD MMMM YYYY".
 */
export function formatDateRange(range: DateRange): string {
  const { from, to } = range;
  if (!from || !to) {
    if (from) {
      return moment(from).format("DD MMMM YYYY");
    }
    if (to) {
      return moment(to).format("DD MMMM YYYY");
    }
    throw new Error("atleast one of 'from' and 'to' dates must be defined");
  }

  const fromMoment = moment(from);
  const toMoment = moment(to);

  if (fromMoment.isSame(toMoment, "month")) {
    return `${fromMoment.format("DD")} - ${toMoment.format("DD MMMM YYYY")}`;
  } else if (fromMoment.isSame(toMoment, "year")) {
    return `${fromMoment.format("DD MMMM")} - ${toMoment.format("DD MMMM YYYY")}`;
  } else {
    return `${fromMoment.format("DD MMMM YYYY")} - ${toMoment.format("DD MMMM YYYY")}`;
  }
}
