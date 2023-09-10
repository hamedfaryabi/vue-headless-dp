import type { DPDay, DPMonth, DPOptions, DPWeek } from "./datepicker";
import { defu } from "defu";

import * as DateFns from "date-fns";
import * as DateFnsJalali from "date-fns-jalali";

/**
 * A hook for creating a headless date picker.
 *
 * @param {DPOptions} options - Configuration options for the date picker.
 * @returns {Object} - An object containing various date picker functions.
 */
export function useHeadlessDatePicker(options?: DPOptions) {
  // Define a variable for the date library
  let dateLib: dateFns;

  /**
   * Default options for the date picker.
   *
   * @type {DPOptions}
   */
  const defaultOptions: DPOptions = {
    calendar: "jalali",
    weekStart: 1, // Monday
    initialMonth: undefined,
    initialYear: undefined,
    equalWeeks: true,
    selected: undefined,
    selectType: "single",
    disabled: [],
    minDate: undefined,
    maxDate: undefined,
    locale: undefined,
  };

  // Merge provided options with default options
  const _options: DPOptions = defu(options, defaultOptions) as DPOptions;

  // Conditionally import the date library based on the calendar option
  if (_options && _options.calendar === "jalali") {
    // Import the "date-fns-jalali" library
    dateLib = DateFnsJalali;
  } else {
    // Import the "date-fns" library (default)
    dateLib = DateFns;
  }

  dateLib.setDefaultOptions({
    ...(_options.locale && { locale: _options.locale }),
    weekStartsOn: _options.weekStart || 1,
  });
  /**
   * Checks if a given date is valid.
   *
   * @param {Date} date - The date to be checked for validity.
   * @throws {Error} Throws an error if the provided date is invalid.
   * @returns {boolean} Returns true if the date is valid, otherwise throws an error.
   */
  const checkDate = (date: Date): boolean => {
    if (dateLib.isValid(date)) return true;
    else throw new Error("The provided date is invalid");
  };
  /**
   * Checks if a date is selected based on the selectType configuration.
   *
   * @param {Date} date - The date to check.
   * @returns {boolean} - `true` if the date is selected, otherwise `false`.
   */
  const isDateSelected = (date: Date): boolean => {
    if (!_options.selected || !checkDate(date)) return false;

    switch (_options.selectType) {
      case "single":
        return dateLib.isSameDay(date, _options.selected);
      case "multiple":
        return _options.selected.some((d) => dateLib.isSameDay(date, d));
      case "range":
        return isWithinRange(date);
      default:
        return false;
    }
  };

  /**
   * Checks if a date is within the range of a selected range.
   *
   * @param {Date} date - The date to check.
   * @returns {boolean} - `true` if the date is within the selected range, otherwise `false`.
   */
  const isWithinRange = (date: Date): boolean => {
    if (!_options.selected || !checkDate(date)) return false;

    const selected = _options.selected as { from: Date; to: Date };
    const interval = {
      start: dateLib.startOfDay(selected.from),
      end: dateLib.endOfDay(selected.to),
    };

    return dateLib.isWithinInterval(date, interval);
  };

  /**
   * Converts a date to a DPDay object.
   *
   * @param {Date} date - The date to convert.
   * @returns {DPDay} - The DPDay object representing the given date.
   */
  const dateToDay = (date: Date): DPDay => {
    checkDate(date);
    const weekIndex = +dateLib.format(date, "c");

    const isBelowMinDate = _options.minDate
      ? dateLib.isBefore(
          dateLib.startOfDay(date),
          dateLib.startOfDay(_options.minDate)
        )
      : false;

    const isAboveMaxDate = _options.maxDate
      ? dateLib.isAfter(
          dateLib.startOfDay(date),
          dateLib.startOfDay(_options.maxDate)
        )
      : false;

    return {
      date,
      weekIndex,
      monthindex: dateLib.getDate(date),
      today: dateLib.isToday(date),
      weekName: {
        narrow: dateLib.format(date, "eeeee"),
        short: dateLib.format(date, "eeeeee"),
        abbreviated: dateLib.format(date, "eee"),
        wide: dateLib.format(date, "eeee"),
      },
      inMonth: dateLib.isThisMonth(date),
      selected: isDateSelected(date),
      disabled:
        _options.disabled?.some((d) => dateLib.isSameDay(d, date)) || false,
      belowMin: isBelowMinDate,
      aboveMax: isAboveMaxDate,
    };
  };

  /**
   * Converts an array of dates to an array of DPWeek objects.
   *
   * @param {Date[]} dates - The array of dates to convert.
   * @returns {DPWeek[]} - An array of DPWeek objects representing the weeks.
   */
  const datesToWeeks = (dates: Date[]): DPWeek[] => {
    dates.every((date) => checkDate(date));
    const daysByWeeks = dates.reduce((acc: DPDay[][], date) => {
      const weekNumber = dateLib.getWeekOfMonth(date);
      const day: DPDay = dateToDay(date);

      if (!acc[weekNumber - 1]) acc[weekNumber - 1] = [];
      acc[weekNumber - 1].push(day);

      return acc;
    }, []);

    return daysByWeeks.map((days) => ({
      days: days,
      number: dateLib.getWeekOfMonth(days[0].date),
    }));
  };

  /**
   * Gets the DPMonth object for a given date or number.
   *
   * @param {Date | number} date - The date or number to represent the month.
   * @returns {DPMonth} - The DPMonth object representing the month.
   */
  const getMonthOfDate = (date: Date): DPMonth => {
    checkDate(date);
    const monthStart = dateLib.startOfMonth(date),
      monthEnd = dateLib.endOfMonth(date);

    const allDays = dateLib.eachDayOfInterval({
      start: monthStart,
      end: monthEnd,
    });
    const weeks: DPWeek[] = datesToWeeks(allDays);

    // Code to ensure equal weeks, if applicable
    if (_options.equalWeeks) {
      if (weeks[0].days.length < 7) {
        const diff = 7 - weeks[0].days.length;
        const startDate = weeks[0].days[0].date;

        for (let index = 1; index <= diff; index++) {
          weeks[0].days.unshift(dateToDay(dateLib.subDays(startDate, index)));
        }
      }

      const weeksLastIndex = weeks.length - 1;
      if (weeks[weeksLastIndex].days.length < 7) {
        const daysLength = weeks[weeksLastIndex].days.length;
        const diff = 7 - daysLength;
        const startDate = weeks[weeksLastIndex].days[daysLength - 1].date;

        for (let index = 1; index <= diff; index++) {
          weeks[weeksLastIndex].days.push(
            dateToDay(dateLib.addDays(startDate, index))
          );
        }
      }
    }

    const sampleDate = allDays[0];
    const month: DPMonth = {
      weeks: weeks,
      name: {
        narrow: dateLib.format(sampleDate, "MMMMM"),
        abbreviated: dateLib.format(sampleDate, "MMM"),
        wide: dateLib.format(sampleDate, "MMMM"),
      },
      number: dateLib.getMonth(sampleDate) + 1,
      year: dateLib.getYear(sampleDate),
    };

    return month;
  };

  /**
   * Gets the DPMonth object for the current month.
   *
   * @returns {DPMonth} - The DPMonth object representing the current month.
   */
  const getCurrentMonth = (): DPMonth => {
    return getMonthOfDate(new Date());
  };

  /**
   * Gets the DPMonth object  based on options.
   *
   * @returns {DPMonth} - The DPMonth object represent based on options.
   */
  const getCalendarMonth = (): DPMonth => {
    const d = new Date();
    if (_options.initialYear) {
      d.setFullYear(_options.initialYear);
    }
    if (_options.initialMonth) {
      d.setMonth(_options.initialMonth - 1);
    }

    return getMonthOfDate(d);
  };

  /**
   * Sets the initialMonth option.
   *
   * @param {DPOptions["initialMonth"]} month - The initial month value to set.
   * @returns {void}
   */
  const setMonth = (month: DPOptions["initialMonth"]): void => {
    _options.initialMonth = month;
  };

  /**
   * Sets the initialYear option.
   *
   * @param {DPOptions["initialYear"]} year - The initial year value to set.
   * @returns {void}
   */
  const setYear = (year: DPOptions["initialYear"]): void => {
    _options.initialYear = year;
  };

  /**
   * Sets both initialMonth and initialYear options.
   *
   * @param {DPOptions["initialMonth"]} month - The initial month value to set.
   * @param {DPOptions["initialYear"]} year - The initial year value to set.
   * @returns {void}
   */
  const setMonthYear = (
    month: DPOptions["initialMonth"],
    year: DPOptions["initialYear"]
  ): void => {
    _options.initialMonth = month;
    _options.initialYear = year;
  };

  /**
   * Sets the selected date based on selectType.
   *
   * @param {DPOptions["selected"]} date - The selected date value to set.
   * @returns {void}
   * @throws {Error} When an invalid date format is provided for the selected type.
   */
  const setSelected = (date: DPOptions["selected"]): void => {
    if (!date) {
      throw new Error("No date provided.");
    }

    const { selectType } = _options;

    if (selectType === "single" && !(date instanceof Date)) {
      throw new Error("Invalid date format for 'single' selectType");
    }

    if (
      selectType === "multiple" &&
      (!Array.isArray(date) || !date.every((d) => d instanceof Date))
    ) {
      throw new Error("Invalid date format for 'multiple' selectType");
    }

    if (
      selectType === "range" &&
      (!("from" in date) ||
        !("to" in date) ||
        !(date.from instanceof Date) ||
        !(date.to instanceof Date))
    ) {
      throw new Error("Invalid date format for 'range' selectType");
    }

    _options.selected = date;
  };

  /**
   * Gets the selected date or dates.
   *
   * @returns {DPOptions["selected"]} - The selected date value.
   */
  const getSelected = (): DPOptions["selected"] => {
    return _options.selected;
  };

  /**
   * Set disabled days in the datepicker
   *
   * @param {(Date | Date[])} date - A single date or an array of dates to be disabled.
   * @throws {Error} Throws an error if the input date format is invalid.
   * @memberof useHeadlessDatePicker
   */
  const setDisabled = (date: Date | Date[]) => {
    if (!Array.isArray(date)) {
      date = [date];
    }

    if (date.every((d) => checkDate(d))) {
      _options.disabled = [...(_options.disabled || []), ...date];
    }
  };

  /**
   * Set the minimum valid date of datepicker
   *
   * @param {Date} date
   */
  const setMinDate = (date: Date) => {
    checkDate(date);
    _options.minDate = date;
  };

  /**
   * Set the maximum valid date of datepicker
   *
   * @param {Date} date
   */
  const setMaxDate = (date: Date) => {
    checkDate(date);
    _options.maxDate = date;
  };

  const setLocale = (locale: Locale) => {
    dateLib.setDefaultOptions({
      locale: locale,
      weekStartsOn: _options.weekStart || 1,
    });
  };

  // Return all functions as an object
  return {
    getMonthOfDate,
    getCurrentMonth,
    getCalendarMonth,
    setMonth,
    setYear,
    setMonthYear,
    setSelected,
    getSelected,
    isDateSelected,
    setDisabled,
    setMinDate,
    setMaxDate,
    setLocale,
  };
}
